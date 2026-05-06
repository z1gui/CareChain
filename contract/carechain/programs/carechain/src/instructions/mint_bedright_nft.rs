use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata as Metaplex, mpl_token_metadata::types::DataV2},
    token::{self, Mint, MintTo, Token, TokenAccount, Transfer},
};
use crate::errors::CareChainError;
use crate::state::{BedClass, BedMode, BedPosition, Facility};

/// 铸造 BedRight NFT
///
/// 流程:
/// 1. 校验床位类型未售罄
/// 2. 用户支付 USDC 到金库
/// 3. 通过 PDA 铸币权限铸造 1 枚 NFT
/// 4. 创建 BedPosition 账户，默认 Yield 模式
/// 5. 更新 BedClass 和 Facility 计数器
#[derive(Accounts)]
#[instruction(facility_id: String, bed_class_id: String)]
pub struct MintBedrightNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"facility", facility_id.as_bytes()],
        bump = facility.bump,
    )]
    pub facility: Box<Account<'info, Facility>>,

    #[account(
        mut,
        seeds = [b"bed_class", facility_id.as_bytes(), bed_class_id.as_bytes()],
        bump = bed_class.bump,
        constraint = bed_class.facility == facility.key(),
    )]
    pub bed_class: Box<Account<'info, BedClass>>,

    /// CHECK: PDA 作为 NFT 铸币权限，程序控制不可被外部滥用
    #[account(
        seeds = [b"mint_authority"],
        bump,
    )]
    pub mint_authority: UncheckedAccount<'info>,

    /// NFT Mint 账户 (decimals=0, 供应量=1)
    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = mint_authority,
    )]
    pub nft_mint: Box<Account<'info, Mint>>,

    /// 用户的 NFT 关联代币账户
    #[account(
        init,
        payer = user,
        associated_token::mint = nft_mint,
        associated_token::authority = user,
    )]
    pub user_nft_ata: Box<Account<'info, TokenAccount>>,

    /// 床位持仓 PDA (seeds = ["bed_position", nft_mint])
    #[account(
        init,
        payer = user,
        space = BedPosition::LEN,
        seeds = [b"bed_position", nft_mint.key().as_ref()],
        bump,
    )]
    pub bed_position: Box<Account<'info, BedPosition>>,

    /// USDC Mint 地址
    pub usdc_mint: Box<Account<'info, Mint>>,

    /// 用户的 USDC 关联代币账户
    #[account(
        mut,
        associated_token::mint = usdc_mint,
        associated_token::authority = user,
    )]
    pub user_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// 金库的 USDC 代币账户
    #[account(
        mut,
        constraint = treasury_usdc_ata.key() == facility.treasury @ CareChainError::InvalidTreasury,
    )]
    pub treasury_usdc_ata: Box<Account<'info, TokenAccount>>,

    /// CHECK: Metaplex Metadata PDA
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            nft_mint.key().as_ref()
        ],
        seeds::program = token_metadata_program.key(),
        bump,
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_metadata_program: Program<'info, Metaplex>,
    pub rent: Sysvar<'info, Rent>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<MintBedrightNft>,
    _facility_id: String,
    _bed_class_id: String,
) -> Result<()> {
    // 校验未售罄
    require!(
        ctx.accounts.bed_class.minted_supply < ctx.accounts.bed_class.total_supply,
        CareChainError::BedClassSoldOut
    );

    let price = ctx.accounts.bed_class.price_usdc;

    // 1. 用户支付 USDC 到金库
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_usdc_ata.to_account_info(),
                to: ctx.accounts.treasury_usdc_ata.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        price,
    )?;

    // 2. 通过 PDA 铸币权限铸造 1 枚 NFT
    let bump = ctx.bumps.mint_authority;
    let signer_seeds: &[&[&[u8]]] = &[&[b"mint_authority", &[bump]]];

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.nft_mint.to_account_info(),
                to: ctx.accounts.user_nft_ata.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
            signer_seeds,
        ),
        1,
    )?;

    // 3. 创建 BedPosition，默认 Yield 模式
    let bed_position = &mut ctx.accounts.bed_position;
    bed_position.owner = ctx.accounts.user.key();
    bed_position.mint = ctx.accounts.nft_mint.key();
    bed_position.facility = ctx.accounts.facility.key();
    bed_position.bed_class = ctx.accounts.bed_class.key();
    bed_position.facility_id = ctx.accounts.bed_class.facility_id.clone();
    bed_position.bed_class_id = ctx.accounts.bed_class.bed_class_id.clone();
    bed_position.mode = BedMode::Yield;
    bed_position.last_mode_switch_ts = Clock::get()?.unix_timestamp;
    bed_position.active = true;
    bed_position.bump = ctx.bumps.bed_position;

    // 4. 更新计数器
    ctx.accounts.bed_class.minted_supply += 1;
    ctx.accounts.facility.sold_nfts += 1;

    // 5. 挂载 Metaplex Metadata，为其注入名字和图片
    let data_v2 = DataV2 {
        name: "CareChain BedRight".to_string(),
        symbol: "BED".to_string(),
        uri: "https://beige-capitalist-xerinae-88.mypinata.cloud/ipfs/bafkreigd2towxght2lw2wuty5z3t7kcc5fvheg26bvh5wfakcrlrdzza4i".to_string(), // 示例 3D 科幻床位占位 JSON
        seller_fee_basis_points: 500, // 5% 版税
        creators: None,
        collection: None,
        uses: None,
    };

    create_nft_metadata(&ctx.accounts, signer_seeds, data_v2)?;

    msg!("BedRight NFT 铸造并注入 Metadata 成功: {}", ctx.accounts.nft_mint.key());
    Ok(())
}

fn create_nft_metadata<'info>(
    accounts: &MintBedrightNft<'info>,
    signer_seeds: &[&[&[u8]]],
    data_v2: DataV2,
) -> Result<()> {
    let cpi_ctx = CpiContext::new_with_signer(
        accounts.token_metadata_program.to_account_info(),
        CreateMetadataAccountsV3 {
            metadata: accounts.metadata_account.to_account_info(),
            mint: accounts.nft_mint.to_account_info(),
            mint_authority: accounts.mint_authority.to_account_info(),
            update_authority: accounts.mint_authority.to_account_info(),
            payer: accounts.user.to_account_info(),
            system_program: accounts.system_program.to_account_info(),
            rent: accounts.rent.to_account_info(),
        },
        signer_seeds,
    );

    create_metadata_accounts_v3(cpi_ctx, data_v2, true, true, None)
}
