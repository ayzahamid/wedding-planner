CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"bride" text NOT NULL,
	"groom" text NOT NULL,
	"wedding_date" date NOT NULL,
	"hall_layout_image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
