CREATE TABLE "guests" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"member_count" integer NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"checked_at" timestamp
);
