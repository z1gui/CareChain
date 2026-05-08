CREATE TABLE auth_user (
    id BIGINT NOT NULL AUTO_INCREMENT,
    wallet_address VARCHAR(64) NOT NULL,
    wallet_chain VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    last_login_at DATETIME(6) NOT NULL,
    CONSTRAINT pk_auth_user PRIMARY KEY (id),
    CONSTRAINT uk_auth_user_wallet_address UNIQUE (wallet_address)
);
