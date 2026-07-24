-- CreateTable
CREATE TABLE "contract_events" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "contract_type" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "ledger_seq" INTEGER NOT NULL,
    "ledger_close_at" TIMESTAMP(3) NOT NULL,
    "tx_hash" TEXT NOT NULL,
    "topic_xdr" TEXT NOT NULL,
    "data_xdr" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "startup_address" TEXT NOT NULL,
    "investor_address" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "asset" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMP(3),
    "dispute_deadline" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jury_cases" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Voting',
    "for_votes" INTEGER NOT NULL DEFAULT 0,
    "against_votes" INTEGER NOT NULL DEFAULT 0,
    "total_votes" INTEGER NOT NULL DEFAULT 0,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jury_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_jurors" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "juror_address" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_jurors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_votes" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "juror_address" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jurors" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "xlm_stake" BIGINT NOT NULL,
    "platform_stake" BIGINT NOT NULL,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "jurors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identities" (
    "id" SERIAL NOT NULL,
    "identity_id" TEXT NOT NULL,
    "commitment_hash" TEXT,
    "is_committed" BOOLEAN NOT NULL DEFAULT false,
    "is_revealed" BOOLEAN NOT NULL DEFAULT false,
    "linked_case_id" INTEGER,
    "backend_ref" TEXT,
    "revealed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "wallet" TEXT,
    "email" TEXT,
    "role" TEXT,
    "onboarding_status" TEXT NOT NULL DEFAULT 'role_selected',
    "display_name" TEXT,
    "bio" TEXT,
    "mfa_secret" TEXT,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "replaced_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_challenges" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "nonce" TEXT NOT NULL,
    "challenge_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT,
    "target_id" TEXT,
    "old_role" TEXT,
    "new_role" TEXT,
    "ip" TEXT,
    "metadata" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "event_type" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "ip" TEXT,
    "fingerprint" TEXT,
    "geo_hint" TEXT,
    "detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_failure_buckets" (
    "id" TEXT NOT NULL,
    "bucket_key" TEXT NOT NULL,
    "fail_count" INTEGER NOT NULL DEFAULT 0,
    "captcha_required" BOOLEAN NOT NULL DEFAULT false,
    "locked_until" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_failure_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_jury_applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "statement" TEXT NOT NULL,
    "experience" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reject_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_jury_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_investor_applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "full_name" TEXT NOT NULL,
    "entity_type" TEXT,
    "accreditation" TEXT,
    "aum" TEXT,
    "source_of_funds" TEXT,
    "portfolio_desc" TEXT,
    "experience_level" TEXT,
    "companies_invested" TEXT,
    "sector_focus" TEXT,
    "investment_range" TEXT,
    "previous_portfolio" TEXT,
    "referral_source" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reject_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pending_investor_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indexer_cursor" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "last_ledger_seq" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indexer_cursor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "on_chain_id" INTEGER,
    "wallet" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pitch" TEXT NOT NULL,
    "ask_amount" BIGINT NOT NULL DEFAULT 0,
    "experience" TEXT,
    "website" TEXT,
    "socials" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reject_reason" TEXT,
    "mask_name" BOOLEAN NOT NULL DEFAULT true,
    "mask_address" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_milestones" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "idx" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "released" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "application_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_votes" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "voter" TEXT NOT NULL,
    "approve" BOOLEAN NOT NULL,
    "comment_hash" TEXT NOT NULL DEFAULT '',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startup_documents" (
    "id" SERIAL NOT NULL,
    "application_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'other',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "startup_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_evaluations" (
    "id" SERIAL NOT NULL,
    "case_id" INTEGER NOT NULL,
    "application_id" INTEGER NOT NULL,
    "ai_agent_address" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "score" INTEGER,
    "verdict" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "web_presence_score" INTEGER,
    "news_sentiment" TEXT,
    "company_verified" BOOLEAN,
    "document_score" INTEGER,
    "evidence_report" TEXT,
    "error_message" TEXT,
    "tx_hash" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contract_events_contract_type_processed_idx" ON "contract_events"("contract_type", "processed");

-- CreateIndex
CREATE INDEX "contract_events_ledger_seq_idx" ON "contract_events"("ledger_seq");

-- CreateIndex
CREATE UNIQUE INDEX "contract_events_tx_hash_event_name_key" ON "contract_events"("tx_hash", "event_name");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_campaign_id_key" ON "campaigns"("campaign_id");

-- CreateIndex
CREATE INDEX "campaigns_state_idx" ON "campaigns"("state");

-- CreateIndex
CREATE INDEX "campaigns_startup_address_idx" ON "campaigns"("startup_address");

-- CreateIndex
CREATE INDEX "campaigns_investor_address_idx" ON "campaigns"("investor_address");

-- CreateIndex
CREATE UNIQUE INDEX "jury_cases_case_id_key" ON "jury_cases"("case_id");

-- CreateIndex
CREATE INDEX "jury_cases_status_idx" ON "jury_cases"("status");

-- CreateIndex
CREATE INDEX "case_jurors_juror_address_idx" ON "case_jurors"("juror_address");

-- CreateIndex
CREATE UNIQUE INDEX "case_jurors_case_id_juror_address_key" ON "case_jurors"("case_id", "juror_address");

-- CreateIndex
CREATE UNIQUE INDEX "case_votes_case_id_juror_address_key" ON "case_votes"("case_id", "juror_address");

-- CreateIndex
CREATE UNIQUE INDEX "jurors_address_key" ON "jurors"("address");

-- CreateIndex
CREATE UNIQUE INDEX "identities_identity_id_key" ON "identities"("identity_id");

-- CreateIndex
CREATE INDEX "identities_is_committed_idx" ON "identities"("is_committed");

-- CreateIndex
CREATE INDEX "identities_is_revealed_idx" ON "identities"("is_revealed");

-- CreateIndex
CREATE INDEX "sessions_wallet_idx" ON "sessions"("wallet");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_wallet_key" ON "users"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_onboarding_status_idx" ON "users"("onboarding_status");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_challenges_nonce_key" ON "auth_challenges"("nonce");

-- CreateIndex
CREATE UNIQUE INDEX "auth_challenges_challenge_hash_key" ON "auth_challenges"("challenge_hash");

-- CreateIndex
CREATE INDEX "auth_challenges_wallet_idx" ON "auth_challenges"("wallet");

-- CreateIndex
CREATE INDEX "auth_challenges_expires_at_idx" ON "auth_challenges"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_target_id_idx" ON "audit_logs"("target_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "auth_events_user_id_idx" ON "auth_events"("user_id");

-- CreateIndex
CREATE INDEX "auth_events_event_type_idx" ON "auth_events"("event_type");

-- CreateIndex
CREATE INDEX "auth_events_ip_idx" ON "auth_events"("ip");

-- CreateIndex
CREATE INDEX "auth_events_created_at_idx" ON "auth_events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "auth_failure_buckets_bucket_key_key" ON "auth_failure_buckets"("bucket_key");

-- CreateIndex
CREATE INDEX "pending_jury_applications_status_idx" ON "pending_jury_applications"("status");

-- CreateIndex
CREATE INDEX "pending_jury_applications_user_id_idx" ON "pending_jury_applications"("user_id");

-- CreateIndex
CREATE INDEX "pending_jury_applications_wallet_idx" ON "pending_jury_applications"("wallet");

-- CreateIndex
CREATE INDEX "pending_investor_applications_status_idx" ON "pending_investor_applications"("status");

-- CreateIndex
CREATE INDEX "pending_investor_applications_user_id_idx" ON "pending_investor_applications"("user_id");

-- CreateIndex
CREATE INDEX "pending_investor_applications_wallet_idx" ON "pending_investor_applications"("wallet");

-- CreateIndex
CREATE INDEX "notifications_wallet_read_idx" ON "notifications"("wallet", "read");

-- CreateIndex
CREATE UNIQUE INDEX "applications_on_chain_id_key" ON "applications"("on_chain_id");

-- CreateIndex
CREATE INDEX "applications_user_id_idx" ON "applications"("user_id");

-- CreateIndex
CREATE INDEX "applications_wallet_idx" ON "applications"("wallet");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "application_milestones_application_id_idx_key" ON "application_milestones"("application_id", "idx");

-- CreateIndex
CREATE INDEX "application_votes_voter_idx" ON "application_votes"("voter");

-- CreateIndex
CREATE UNIQUE INDEX "application_votes_application_id_voter_key" ON "application_votes"("application_id", "voter");

-- CreateIndex
CREATE INDEX "startup_documents_application_id_idx" ON "startup_documents"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_evaluations_case_id_key" ON "ai_evaluations"("case_id");

-- CreateIndex
CREATE INDEX "ai_evaluations_status_idx" ON "ai_evaluations"("status");

-- CreateIndex
CREATE INDEX "ai_evaluations_application_id_idx" ON "ai_evaluations"("application_id");

-- AddForeignKey
ALTER TABLE "case_jurors" ADD CONSTRAINT "case_jurors_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "jury_cases"("case_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_votes" ADD CONSTRAINT "case_votes_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "jury_cases"("case_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_events" ADD CONSTRAINT "auth_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_jury_applications" ADD CONSTRAINT "pending_jury_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_investor_applications" ADD CONSTRAINT "pending_investor_applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_milestones" ADD CONSTRAINT "application_milestones_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_votes" ADD CONSTRAINT "application_votes_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "startup_documents" ADD CONSTRAINT "startup_documents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_evaluations" ADD CONSTRAINT "ai_evaluations_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
