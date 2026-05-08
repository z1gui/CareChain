use anchor_lang::{prelude::*, system_program};

use crate::{
    errors::QueueError,
    initialize_queue::refresh_pricing,
    state::{
        parse_bed_position, BedRightBedMode, QueueEntry, QueueLane, QueueState, QueueStatus,
        MAX_APPLICANT_ID_LEN, MAX_FACILITY_ID_LEN,
    },
};

#[derive(Accounts)]
#[instruction(facility_id: String, applicant_id: String)]
pub struct RegisterP1FromNft<'info> {
    #[account(mut)]
    pub applicant: Signer<'info>,
    #[account(
        mut,
        seeds = [b"queue_state", facility_id.as_bytes()],
        bump = queue_state.bump,
    )]
    pub queue_state: Account<'info, QueueState>,
    /// CHECK: validated in handler
    pub bedright_program: UncheckedAccount<'info>,
    /// CHECK: validated in handler
    pub mint: UncheckedAccount<'info>,
    /// CHECK: validated in handler
    pub bed_position: UncheckedAccount<'info>,
    /// CHECK: will be created or updated in handler
    #[account(
        mut,
        seeds = [b"queue_entry", facility_id.as_bytes(), applicant_id.as_bytes()],
        bump,
    )]
    pub queue_entry: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

fn apply_register_p1(
    queue_state: &mut QueueState,
    queue_entry: &mut QueueEntry,
    entry_exists: bool,
    facility_id: &str,
    applicant_id: &str,
    wallet: Pubkey,
    mint: Pubkey,
    bed_position: Pubkey,
    registered_at: i64,
    entry_bump: u8,
) -> Result<u64> {
    require!(
        !facility_id.is_empty()
            && facility_id.len() <= MAX_FACILITY_ID_LEN
            && queue_state.facility_id == facility_id,
        QueueError::InvalidFacility
    );
    require!(
        !applicant_id.is_empty() && applicant_id.len() <= MAX_APPLICANT_ID_LEN,
        QueueError::InvalidApplicantId
    );

    if entry_exists {
        require!(
            queue_entry.status != QueueStatus::Admitted,
            QueueError::ApplicantAlreadyAdmitted
        );
        require!(
            queue_entry.applicant_id.is_empty() || queue_entry.applicant_id == applicant_id,
            QueueError::InvalidApplicantId
        );
        require!(
            queue_entry.facility_id.is_empty() || queue_entry.facility_id == facility_id,
            QueueError::InvalidFacility
        );
    }

    let was_waiting = entry_exists && queue_entry.status == QueueStatus::Waiting;
    let was_lane = queue_entry.lane;
    let entering_waiting_p1 = !entry_exists || !was_waiting || was_lane != QueueLane::P1;

    if was_waiting {
        match was_lane {
            QueueLane::P1 => {}
            QueueLane::P2 => {
                queue_state.p2_count = queue_state
                    .p2_count
                    .checked_sub(1)
                    .ok_or(QueueError::MathOverflow)?;
            }
            QueueLane::P3 => {
                queue_state.p3_count = queue_state
                    .p3_count
                    .checked_sub(1)
                    .ok_or(QueueError::MathOverflow)?;
                refresh_pricing(queue_state);
            }
        }
    }

    if entering_waiting_p1 {
        queue_state.p1_count = queue_state
            .p1_count
            .checked_add(1)
            .ok_or(QueueError::MathOverflow)?;
    }
    queue_state.updated_at = registered_at;

    let queue_no = if entry_exists { queue_entry.queue_no } else { 0 };
    let created_at = if entry_exists {
        queue_entry.created_at
    } else {
        registered_at
    };
    let burn_amount = if entry_exists { queue_entry.burn_amount } else { 0 };

    queue_entry.applicant_id = applicant_id.to_string();
    queue_entry.facility_id = facility_id.to_string();
    queue_entry.wallet = Some(wallet);
    queue_entry.mint = Some(mint);
    queue_entry.lane = QueueLane::P1;
    queue_entry.queue_no = queue_no;
    queue_entry.burn_amount = burn_amount;
    queue_entry.status = QueueStatus::Waiting;
    queue_entry.bed_position = Some(bed_position);
    queue_entry.created_at = created_at;
    queue_entry.updated_at = registered_at;
    queue_entry.bump = entry_bump;

    Ok(queue_no)
}

fn create_queue_entry_account(
    ctx: &Context<RegisterP1FromNft>,
    facility_id: &str,
    applicant_id: &str,
) -> Result<()> {
    let rent = Rent::get()?;
    let lamports = rent.minimum_balance(QueueEntry::LEN);
    let signer_seeds: &[&[u8]] = &[
        b"queue_entry",
        facility_id.as_bytes(),
        applicant_id.as_bytes(),
        &[ctx.bumps.queue_entry],
    ];
    let cpi_accounts = system_program::CreateAccount {
        from: ctx.accounts.applicant.to_account_info(),
        to: ctx.accounts.queue_entry.to_account_info(),
    };

    system_program::create_account(
        CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &[signer_seeds],
        ),
        lamports,
        QueueEntry::LEN as u64,
        &crate::ID,
    )
}

fn load_queue_entry(queue_entry: &UncheckedAccount<'_>) -> Result<QueueEntry> {
    let data = queue_entry.try_borrow_data()?;
    let mut data_slice: &[u8] = &data;
    QueueEntry::try_deserialize(&mut data_slice)
}

fn store_queue_entry(queue_entry: &UncheckedAccount<'_>, entry: &QueueEntry) -> Result<()> {
    let mut data = queue_entry.try_borrow_mut_data()?;
    data.fill(0);
    data[..8].copy_from_slice(&QueueEntry::DISCRIMINATOR);
    let mut dst: &mut [u8] = &mut data[8..];
    entry.serialize(&mut dst)?;
    Ok(())
}

/// 作用：验证 BedRight NFT 与床位信息后，为申请人创建或更新 P1 排队条目。
/// 请求参数：`ctx` 为申请人、NFT、床位和队列账户上下文，`facility_id` 为设施业务 ID，`applicant_id` 为申请人业务 ID。
/// 返回参数：成功返回 `Ok(())`，失败返回对应的链上错误。
pub fn handler(
    ctx: Context<RegisterP1FromNft>,
    facility_id: String,
    applicant_id: String,
) -> Result<()> {
    let (expected_bed_position, _) = Pubkey::find_program_address(
        &[b"bed_position", ctx.accounts.mint.key().as_ref()],
        &ctx.accounts.bedright_program.key(),
    );
    require!(
        ctx.accounts.bed_position.key() == expected_bed_position,
        QueueError::InvalidBedPosition
    );
    require!(
        ctx.accounts.bed_position.owner == &ctx.accounts.bedright_program.key(),
        QueueError::InvalidBedPosition
    );

    let parsed_bed_position = parse_bed_position(&ctx.accounts.bed_position)?;
    require!(
        parsed_bed_position.owner == ctx.accounts.applicant.key(),
        QueueError::UnauthorizedNftOwner
    );
    require!(
        parsed_bed_position.mode == BedRightBedMode::Occupancy,
        QueueError::InvalidBedRightMode
    );
    require!(
        parsed_bed_position.mint == ctx.accounts.mint.key(),
        QueueError::InvalidBedPosition
    );
    require!(
        parsed_bed_position.facility == ctx.accounts.queue_state.facility
            && parsed_bed_position.facility_id == facility_id,
        QueueError::InvalidBedRightFacility
    );

    let entry_exists = !ctx.accounts.queue_entry.data_is_empty();
    if !entry_exists {
        create_queue_entry_account(&ctx, &facility_id, &applicant_id)?;
    }

    let mut queue_entry = if entry_exists {
        load_queue_entry(&ctx.accounts.queue_entry)?
    } else {
        QueueEntry {
            applicant_id: String::new(),
            facility_id: String::new(),
            wallet: None,
            mint: None,
            lane: QueueLane::P1,
            queue_no: 0,
            burn_amount: 0,
            status: QueueStatus::Waiting,
            bed_position: None,
            created_at: 0,
            updated_at: 0,
            bump: ctx.bumps.queue_entry,
        }
    };

    let queue_state = &mut ctx.accounts.queue_state;
    let now = Clock::get()?.unix_timestamp;
    let _queue_no = apply_register_p1(
        queue_state,
        &mut queue_entry,
        entry_exists,
        &facility_id,
        &applicant_id,
        ctx.accounts.applicant.key(),
        ctx.accounts.mint.key(),
        ctx.accounts.bed_position.key(),
        now,
        ctx.bumps.queue_entry,
    )?;

    store_queue_entry(&ctx.accounts.queue_entry, &queue_entry)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn queue_state_fixture() -> QueueState {
        QueueState {
            facility_id: "facility-1".to_string(),
            facility: Pubkey::new_unique(),
            admin_wallet: Pubkey::new_unique(),
            p1_count: 0,
            p2_count: 2,
            p3_count: 5,
            next_queue_no: 99,
            multiplier_bps: 10_000,
            burn_price_per_day: 10,
            updated_at: 0,
            bump: 4,
        }
    }

    fn existing_entry() -> QueueEntry {
        QueueEntry {
            applicant_id: "applicant-1".to_string(),
            facility_id: "facility-1".to_string(),
            wallet: Some(Pubkey::new_unique()),
            mint: None,
            lane: QueueLane::P3,
            queue_no: 42,
            burn_amount: 0,
            status: QueueStatus::Waiting,
            bed_position: None,
            created_at: 1_700_000_000,
            updated_at: 1_700_000_010,
            bump: 8,
        }
    }

    #[test]
    fn register_p1_promotes_waiting_p3_entry_and_updates_counts() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = existing_entry();
        let applicant = Pubkey::new_unique();
        let mint = Pubkey::new_unique();
        let bed_position = Pubkey::new_unique();
        let now = 1_700_000_100;

        let result = apply_register_p1(
            &mut queue_state,
            &mut queue_entry,
            true,
            "facility-1",
            "applicant-1",
            applicant,
            mint,
            bed_position,
            now,
            8,
        )
        .expect("register should succeed");

        assert_eq!(result, 42);
        assert_eq!(queue_state.p1_count, 1);
        assert_eq!(queue_state.p3_count, 4);
        assert_eq!(queue_state.p2_count, 2);
        assert_eq!(queue_entry.wallet, Some(applicant));
        assert_eq!(queue_entry.mint, Some(mint));
        assert_eq!(queue_entry.bed_position, Some(bed_position));
        assert!(queue_entry.lane == QueueLane::P1);
        assert!(queue_entry.status == QueueStatus::Waiting);
        assert_eq!(queue_entry.queue_no, 42);
        assert_eq!(queue_entry.updated_at, now);
    }

    #[test]
    fn register_p1_keeps_counts_stable_for_existing_waiting_p1_entry() {
        let mut queue_state = queue_state_fixture();
        queue_state.p1_count = 3;
        let mut queue_entry = QueueEntry {
            lane: QueueLane::P1,
            status: QueueStatus::Waiting,
            queue_no: 0,
            ..existing_entry()
        };

        apply_register_p1(
            &mut queue_state,
            &mut queue_entry,
            true,
            "facility-1",
            "applicant-1",
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            1_700_000_200,
            8,
        )
        .expect("re-register should succeed");

        assert_eq!(queue_state.p1_count, 3);
        assert_eq!(queue_state.p2_count, 2);
        assert_eq!(queue_state.p3_count, 5);
    }

    #[test]
    fn register_p1_creates_new_waiting_entry_with_zero_queue_number() {
        let mut queue_state = queue_state_fixture();
        let mut queue_entry = QueueEntry {
            applicant_id: String::new(),
            facility_id: String::new(),
            wallet: None,
            mint: None,
            lane: QueueLane::P1,
            queue_no: 99,
            burn_amount: 77,
            status: QueueStatus::Cancelled,
            bed_position: None,
            created_at: 0,
            updated_at: 0,
            bump: 0,
        };

        let result = apply_register_p1(
            &mut queue_state,
            &mut queue_entry,
            false,
            "facility-1",
            "applicant-2",
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            Pubkey::new_unique(),
            1_700_000_300,
            11,
        )
        .expect("new register should succeed");

        assert_eq!(result, 0);
        assert_eq!(queue_state.p1_count, 1);
        assert_eq!(queue_state.p2_count, 2);
        assert_eq!(queue_state.p3_count, 5);
        assert_eq!(queue_entry.queue_no, 0);
        assert_eq!(queue_entry.burn_amount, 0);
        assert_eq!(queue_entry.bump, 11);
    }
}
