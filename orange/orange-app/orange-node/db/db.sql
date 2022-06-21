create database orange;
CREATE SCHEMA public;
-- 사용자
create table users(
user_no serial not null,
user_id varchar(20) not null,
user_pw varchar(100) not null,
user_name varchar(20) not null,
state integer not null DEFAULT 1,
reg_dt timestamp not null DEFAULT now(),
user_tokens jsonb NULL DEFAULT '[]'::jsonb,
CONSTRAINT users_pkey PRIMARY KEY (user_no)
);
COMMENT ON COLUMN public.users.state IS '0 탈퇴 1 정상 2 계정잠금';
COMMENT ON COLUMN public.users.user_tokens IS '로그인시 jwt 저장';

--게시판 
CREATE TABLE public.board (
	board_no serial4 NOT NULL,
	board_content TEXT  NULL,
	board_count integer not null DEFAULT 1,
	board_title varchar not null,
	state int4 NOT NULL DEFAULT 1,
	reg_dt timestamp NOT NULL DEFAULT now(),
	end_dt timestamp NULL,
	user_no serial4 NOT NULL,    
	CONSTRAINT board_pkey PRIMARY KEY (board_no),
	CONSTRAINT users_user_no_fkey FOREIGN KEY (user_no) REFERENCES public.users(user_no) ON DELETE CASCADE ON UPDATE CASCADE
);
COMMENT ON COLUMN public.board.state IS '0 삭제 1 정상';
COMMENT ON COLUMN public.board.reg_dt IS '생성시간';
COMMENT ON COLUMN public.board.end_dt IS '최종수정시간';