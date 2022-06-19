create database red;
CREATE SCHEMA public;
-- 사용자
create table users(
user_no serial not null,
user_id varchar(20) not null,
user_pw varchar(100) not null,
user_name varchar(20) not null,
state integer not null DEFAULT 1,
reg_dt timestamp not null DEFAULT now(),
CONSTRAINT users_pkey PRIMARY KEY (user_no)
);
COMMENT ON COLUMN public.users.state IS '0 탈퇴 1 정상 2 계정잠금';

--메모
CREATE TABLE public.note (
	note_no serial4 NOT NULL,
	note_data jsonb NULL DEFAULT '{"note_text": [{"content": null, "deadline": null,"note_checked":null}], "note_index": null}'::jsonb,
	state int4 NOT NULL DEFAULT 1,
	reg_dt timestamp NOT NULL DEFAULT now(),
	user_no serial4 NOT NULL,
    end_dt timestamp NOT NULL DEFAULT now(),
	CONSTRAINT note_pkey PRIMARY KEY (note_no),
	CONSTRAINT users_user_no_fkey FOREIGN KEY (user_no) REFERENCES public.users(user_no) ON DELETE CASCADE ON UPDATE CASCADE
);
COMMENT ON COLUMN public.note.state IS '0 삭제 1 정상';
COMMENT ON COLUMN public.note.reg_dt IS '생성시간';
COMMENT ON COLUMN public.note.end_dt IS '최종수정시간';
COMMENT ON COLUMN public.note.note_data IS '{"note_text": [{"content": null, "deadline": null,"note_checked":null}], "note_index": null}';