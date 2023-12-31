# Farming Paper

분야를 가리지 않는, 극한의 **셀프 암기 학습** 도구

농사꾼이 농사를 지으며 자급자족하듯 스스로 문제를 만들어서 스스로 문제를 푸는 플랫폼입니다.

🚀 지금 바로 사용해보세요! <https://farming-paper.vercel.app>

<h2 align="center">
☺️ 어서오세요~ 환영합니다!
</h2>

Farming Paper 서비스에 관심이 있으신 **당신**!

모든 방식의 협업, 제안, 건의사항, 대화는 언제나 열려있습니다.

[Issues](https://github.com/farming-paper/farming-paper/issues)에 이야깃거리를 남겨주거나 개발자 이메일 (<eszqsc112@gmail.com>)로 메시지를 남겨주세요.

## 이야기

**Farming Paper**는 제(메인테이너)가 혼자서 열심히 방송통신대학교 공부를 해야 하는 상황 속에서 태어난 서비스입니다. 하여간 혼자 공부하는 건 절대 쉬운 일이 아니지요... 조금이라도 더 효율적으로 공부하기 위해, 그리고 틈틈히 공부할 수 있는 방법을 만들기 위해 노력했어요. 결론적으로 저는 아래와 같은 흐름 속에서 효과를 많이 봤습니다.

1. 먼저 문제를 만들어야 합니다. 문제를 만들기 위해서는 학습 내용을 적절히 **요약**해야 하고, 미래에 시간이 좀 지났을 때 헷갈리거나 잊기 쉬운 개념을 미리 **예측**해야 합니다. 이 과정에서 학습한 내용이 온전히 내 것이 되었는지 확인할 수 있습니다.
2. 문제를 풀 때에는 **끝없이** 제시됩니다. 틀린 문제는 다시 나올 확률이 올라가서 더 효과적인 학습이 가능합니다.
3. 문제를 풀다가 중간에 답을 보는 것도, 수정하는 것도, 패스하는 것도 가능합니다. Farming Paper는 루틴과 콘텐츠가 잘 정리된 서비스라기 보다는 처음부터 끝까지 제어할 수 있는 **학습 도구**라는 역할을 충실히 하려고 합니다. 주도적인 학습으로써 효율을 극대화합니다.

Farming Paper라는 이름은 *컨닝페이퍼*와 *지식 농사*를 합친 느낌으로 만들어봤습니다.

## 방향성

- **빈 칸 문제**를 손쉽게 만들고 관리할 수 있도록 하기
- **필기 도구**로써도 훌륭하도록 하기. 안정감 높이기. 마치 노션처럼.
- 문제를 공유하고 발자취를 기록함으로써 혼자 공부하는 게 아니라 다른 사람과 **함께** 공부하는 느낌을 줄 수 있도록 하기.

---

## DB 관련 세팅

> [!CAUTION] > **수정 필요. 데이터베이스 관리는 prisma 도 함께 진행하고 있음**

먼저 필요한 프로그램을 설치합니다.

- [supabase cli](https://supabase.com/docs/guides/cli)를 활용합니다. (`brew install supabase`)
- [Docker](https://www.docker.com/)가 설치되어 있어야 합니다. 맥일 경우 공식 홈페이지에서 docker desktop 을 다운로드 받으면 됩니다.

```bash
supabase init # 현재 저장소에서 한 번도 supabase 관련 작업을 한 적이 없을 때. supabse 폴더 생성됨.
supabase login # 자신의 계정으로 로그인합니다.
supabase link --project-ref $SUPABASE_PROJECT_ID --password $SUPABASE_DB_PASSWORD # .env 파일에서 불러옵니다.
```

현재 migrations 를 기반으로 DB 및 스튜디오를 시작합니다. 스튜디오에서 일어나는 모든 변화는 migrations로 기록됩니다.

```bash
supabase start
```

1. 스튜디오에서 DB 스키마 등을 수정.
2. `pnpm sb-diff <filename>` 명령으로 migrations 파일 생성
3. 해당 마이그레이션이 파일로써 잘 존재하는지, 변경사항이 맞는지 체크
4. `pnpm sb-push` 명령으로 변경사항을 스테이징에 적용

그리고 GitHub 로 푸쉬가 성공하기 위해서 아래와 같은 secrets 설정이 필요합니다. 이 설정은 Github Actions 에서 스테이징 서버로 push 하여, 사용자가 실수로 `pnpm sb-push` 를 하지 않는 상황을 방지합니다.

저장소 → Settings → Secrets → Actions → 우측 상단 New repository secret 으로 추가.

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_PROJECT_ID`

참고로 스테이징이란, 단순히 `SUPABASE_ACCESS_TOKEN` 과 `SUPABASE_PROJECT_ID` 로 연결된 서버를 지칭합니다.

뭔가 명령이 먹히지 않을 때에는 supabase/cli 를 업그레이드 해줍니다.

```sh
brew upgrade supabase
```

## 개발 스타일 가이드

- <https://github.com/remix-run/remix/issues/7466> 땜에 `remix dev --manual`로 실행해야 합니다.
- `throw new Response("page is NaN", { status: 400 });` 와 같이 `loader` 단의 중간에서 쉽게 응답을 날릴 수 있습니다. validation 등에 적극 활용합시다.
- `get`: 값을 가져오지만, 실패하거나 값이 없을 시에는 `null`을 반환합니다.
- `require`: 값을 가져오지만, 실패하거나 값이 없을 시에는 `throw new Response(...)`를 합니다. 파라미터 값을 가져올 때 validation은 Zod를 적극적으로 활용합시다.
- `tailwind.config.js`` 등 root 차원의 파일을 수정할 때에는 변경사항이 자동으로 적용되지 않을 수 있으므로 dev server 를 재시작하는 게 권장됩니다.

## 참고

- [예전문서 (깃랩)](https://gitlab.com/EzKorry/kestion/-/wikis/home)
- [[Markdown] An option to highlight a "Note" and "Warning" using blockquote (Beta)](https://github.com/orgs/community/discussions/16925)
