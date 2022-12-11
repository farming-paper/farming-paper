# 파밍페이퍼 Farming Paper (가제)

농사꾼이 농사를 지으며 자급자족하듯 스스로 문제를 만들어서 스스로 문제를 푸는 플랫폼입니다.

🚀 서비스 배포 보기 : <https://learning-kappa.vercel.app>

## 주기능

- 파밍페이퍼는 **암기**의 효율을 최대한으로 끌어올리기 위한 학습 **도구**입니다.
- 문제 **제작이 쉬워야** 합니다.
- 문제의 출제는 취약한 부분을 중점으로 선별되어 **자동**으로 이루어지도록 합니다.
- 문제의 결과를 기반으로 **문제를 수정**하기 쉬워야 합니다.

## 주기능에 대한 부가 설명

- 암기에 특화되므로 심층적인 개념 이해는 고려하지 않습니다.
- 문제를 만들기 쉬워야 한다는 건, 문제를 설계하는 데 있어서 너무 많은 노력을 들이면 안된다는 뜻입니다. 문제 하나하나는 신속하게 만들어나갈 수 있어야 합니다. 질문 하나에 빈 칸이 너무 많거나 빈칸 하나하나에 보기를 주어지도록 하는 것 등의 복잡한 설계는, 개발자나 사용자 모두 지양해야 합니다.
- 문제가 자동으로 나옴으로써 사용자가 자신이 모르는 문제를 찾아 선택해야 하는 결정 피로를 줄입니다.
- 암기를 하는 게 중요하므로, 이미 암기한 항목에 대해서는 빠르게 넘길 수 있어야 합니다. 예를 들어 문제 풀이 페이지에서 "정답 처리" 혹은 "정답 보기"와 같은 버튼이 있을 수 있습니다. 정답률 등은 중요하지 않습니다. 다만 심리적 보상을 위해, 실제로 문제 풀이에 투자한 행위 등을 측정하여, 깃허브 잔디 심듯이 보여줍니다.
- 문제의 결과를 기반으로 문제를 수정하는 것의 예시는 다음과 같습니다:
   - 오탈자 수정
   - 너무 자주 나오는 문제에 대해 가중치 하향
   - 자주 틀리는 문제에 대해 가중치 상향
- 빈 칸과 정답의 개수 간 1:1 매칭을 시키지 않습니다. (연구 필요)

## 부가 기능

- 문제 공유 기능 - 작성한 문제를 사용자끼리 주고받을 수 있도록 합니다.
   - 남에게 도움을 줄 수도 있고, 남들에게 도움을 받을 수도 있도록 하기.
- 필기/기록에 들인 시간이 헛되지 않아야 합니다.
   - 문제를 출제하기 위해서는 공부한 내용을 적어야 한다는 시간적 비용이 소요됩니다.
   - 이를 소중히 여기기 위해, export 기능을 추가합니다.
   - 다른 사람과 문제를 공유하는 것도 도움이 될 수 있습니다.

## 용어

- `문제(Question)`: `질문(Message)` + `정답(Answer)`
- `태그(Tag)`: 문제를 분류하기 위한 도구

## 로드맵

- 현재
   - 문제는 소스코드 상으로 입력
   - 문제의 유형은 주관식 및 객관식 등으로 제공
   - 문제를 틀리면 가중치가 10 곱해지고, 문제를 맞추면 가중치가 10 나눠집니다. (다시 출제될 확률이 10배 늘어나거나 10배 줄어듭니다.)
- 문제 DB화 + 문제 수정 UI 추가
- SPA 및 앱 출시
- 로그인 기능, 문제 공유 등

## 구현

- 문제 자체 가중치, 날짜 기반 가중치, 지금까지 맞춘 횟수 및 틀린 횟수를 모두 고려하기에는 컴퓨팅 비용이 너무 많이 들어갑니다. 그래서 문제 자체 가중치만 남기고, 개별 문제 결과 페이지 혹은 묶음 결과 페이지에서 가중치를 수정하기 쉽도록 UI 를 제공하는 방향으로 가고자 합니다.
- 애니메이션은 framer-motion 활용
- remix app. 
- 테스트는 vitest



## 잡다한 이야기

- 컨닝페이퍼와 어감이 비슷해서 익숙하지만, 좀 더 긍정적이고 묵직한 이미지를 노렸습니다.


## 참고

- [예전문서 (깃랩)](https://gitlab.com/EzKorry/kestion/-/wikis/home)
