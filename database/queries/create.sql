-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/QU9F4l
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- POLICE FORCE DATABASE
-- Aaron Wollman, Will Huang,
-- Kelsey Richardson Blackwell, Mark Erickson


CREATE TABLE "subject" (
    "subject_id" INT   NOT NULL,
    "race" VARCHAR(20),
    "sex" VARCHAR(25)   NOT NULL,
    "age" INT   NOT NULL,
    "has_injury" BOOLEAN,
    "role" VARCHAR(25)   NOT NULL,
    "role_number" INT   NOT NULL,
    "resistance" VARCHAR(25),
    CONSTRAINT "pk_subject" PRIMARY KEY (
        "subject_id"
     )
);

CREATE TABLE "case" (
    "case_id" INT   NOT NULL,
    "case_number" VARCHAR(50)   NOT NULL,
    "is_911_call" BOOLEAN,
    "problem" VARCHAR(50)   NOT NULL,
    "primary_offense" VARCHAR(15)   NOT NULL,
    "date" VARCHAR(15)   NOT NULL,
    "latitude" FLOAT   NOT NULL,
    "longitude" FLOAT   NOT NULL,
    "city_id" INT   NOT NULL,
    "precinct_id" INT   NOT NULL,
    "neighborhood_id" INT   NOT NULL,
    "police_force_id" INT   NOT NULL,
    "year" INT   NOT NULL,
    "month" INT   NOT NULL,
    "day" INT   NOT NULL,
    "hour" INT   NOT NULL,
    CONSTRAINT "pk_case" PRIMARY KEY (
        "case_id"
     )
);

CREATE TABLE "city" (
    "city_id" INT   NOT NULL,
    "city_name" VARCHAR(50)   NOT NULL,
    CONSTRAINT "pk_city" PRIMARY KEY (
        "city_id"
     )
);

CREATE TABLE "city_summary" (
    "city_summary_id" INT   NOT NULL,
    "city_id" INT   NOT NULL,
    "year" INT   NOT NULL,
    "total_calls" INT   NOT NULL,
    CONSTRAINT "pk_city_summary" PRIMARY KEY (
        "city_summary_id"
     )
);

CREATE TABLE "precinct" (
    "precinct_id" INT   NOT NULL,
    "precint_name" VARCHAR(50)   NOT NULL,
    CONSTRAINT "pk_precinct" PRIMARY KEY (
        "precinct_id"
     )
);

CREATE TABLE "precinct_summary" (
    "precinct_summary_id" INT   NOT NULL,
    "precinct_id" INT   NOT NULL,
    "year" INT   NOT NULL,
    "total_calls" INT   NOT NULL,
    CONSTRAINT "pk_precinct_summary" PRIMARY KEY (
        "precinct_summary_id"
     )
);

CREATE TABLE "neighborhood" (
    "neighborhood_id" INT   NOT NULL,
    "neighborhood_name" VARCHAR(50)   NOT NULL,
    CONSTRAINT "pk_neighborhood" PRIMARY KEY (
        "neighborhood_id"
     )
);

CREATE TABLE "neighborhood_summary" (
    "neighborhood_summary_id" INT   NOT NULL,
    "neighborhood_id" INT   NOT NULL,
    "year" INT   NOT NULL,
    "total_calls" INT   NOT NULL,
    CONSTRAINT "pk_neighborhood_summary" PRIMARY KEY (
        "neighborhood_summary_id"
     )
);

CREATE TABLE "force_categories" (
    "force_category_id" INT   NOT NULL,
    "category" VARCHAR(50)   NOT NULL,
    CONSTRAINT "pk_force_categories" PRIMARY KEY (
        "force_category_id"
     )
);

CREATE TABLE "police_force" (
    "police_force_id" INT   NOT NULL,
    "force_number" INT   NOT NULL,
    "force_category_id" INT   NOT NULL,
    "force_action" VARCHAR(50)   NOT NULL,
    "force_report_number" INT   NOT NULL,
    "subject_id" INT   NOT NULL,
    CONSTRAINT "pk_police_force" PRIMARY KEY (
        "police_force_id"
     )
);

ALTER TABLE "case" ADD CONSTRAINT "fk_case_city_id" FOREIGN KEY("city_id")
REFERENCES "city" ("city_id");

ALTER TABLE "case" ADD CONSTRAINT "fk_case_precinct_id" FOREIGN KEY("precinct_id")
REFERENCES "precinct" ("precinct_id");

ALTER TABLE "case" ADD CONSTRAINT "fk_case_neighborhood_id" FOREIGN KEY("neighborhood_id")
REFERENCES "neighborhood" ("neighborhood_id");

ALTER TABLE "case" ADD CONSTRAINT "fk_case_police_force_id" FOREIGN KEY("police_force_id")
REFERENCES "police_force" ("police_force_id");

ALTER TABLE "city_summary" ADD CONSTRAINT "fk_city_summary_city_id" FOREIGN KEY("city_id")
REFERENCES "city" ("city_id");

ALTER TABLE "precinct_summary" ADD CONSTRAINT "fk_precinct_summary_precinct_id" FOREIGN KEY("precinct_id")
REFERENCES "precinct" ("precinct_id");

ALTER TABLE "neighborhood_summary" ADD CONSTRAINT "fk_neighborhood_summary_neighborhood_id" FOREIGN KEY("neighborhood_id")
REFERENCES "neighborhood" ("neighborhood_id");

ALTER TABLE "police_force" ADD CONSTRAINT "fk_police_force_force_category_id" FOREIGN KEY("force_category_id")
REFERENCES "force_categories" ("force_category_id");

ALTER TABLE "police_force" ADD CONSTRAINT "fk_police_force_subject_id" FOREIGN KEY("subject_id")
REFERENCES "subject" ("subject_id");

