import type { Question } from "../types";

export const questions: Question[] = [
  {
    type: "short",
    message:
      "데이터의 일반적인 특징 중 동일한 내용의 데이터가 중복되어 있지 않은 것",
    correct: "통합된 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "데이터의 일반적인 특징 중 컴퓨터의 저장매체에 있는 것.",
    correct: "저장된 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "데이터의 일반적인 특징 중 여러 사용자가 서로 다른 목적으로 접근할 수 있는 것",
    correct: "공용 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "데이터의 일반적인 특징 중 새로운 데이터의 삽입, 기존 데이터의 수정, 삭제, 업데이트를 하여 항상 최신의 정확한 데이터 상태를 유지하는 것",
    correct: "변화하는 데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "학습과 체험을 통해 개인에게 습득되어 있지만 겉으로 드러나지 않는 상태의 지식",
    correct: "암묵지",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "문서나 매뉴얼처럼 외부로 표출돼 여러 사람이 공유할 수 있는 지식",
    correct: "형식지",
    category: "1",
    tags: ["1일차"],
  },

  {
    type: "short_order",
    message:
      "암묵지-형식지의 상호작용: 조직의 지식으로 ___를 위한 ___, 개인에게 ___ 및 습득되는 ___",
    correct: ["공통화", "표출화", "연결", "내면화"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_order",
    message:
      "???피라미드. 객관적인 사실로부터 얻을 수 있는 것들을 차례대로. 답은 네 가지.",
    correct: ["데이터", "정보", "지식", "지혜"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_multi",
    message: "데이터베이스의 다섯가지 측면 (측면이라는 말 제외)",
    correct: [
      "정보의 축적 및 전달",
      "정보이용",
      "정보관리",
      "정보기술발전",
      "경제 산업적",
    ],
    weight: 2,
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "DB의 ___ 측면: 이용자의 정보 요구에 따라 원하는 정보를 신속하고 정확하고 경제적으로 찾아내거나 획득 가능",
    correct: "정보이용",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "DB의 ___ 측면: 정리, 저장, 검색, 관리, 체계적으로 축적, 추가나 갱신 용이한 측면",
    correct: "정보관리",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "DB의 ___ 측면: 네트워크 기술의 발달을 견인할 수 있음.",
    correct: "정보기술발전",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "DB의 ___ 측면: 국민의 편의를 증진하고 사회 활동의 효율성 제고",
    correct: "경제산업적",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "데이터베이스에서 명령을 수행하는 하나의 단위",
    correct: "트랜잭션",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_multi",
    message: "트랜잭션 네 가지 특성",
    correct: ["원자성", "일관성", "고립성", "지속성"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "영역별로 구축되던 단순 자동화 중심, 각각 거래 단위에 초점을 맞추는 데 목적이 있음 (예: 주문입력)",
    correct: "OLTP",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "데이터마이닝 등의 기술이 등장하며, 단순한 정보의 수집과 공유에서 탈피하여 분석이 중심이 되는 것",
    correct: "OLAP",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "기업에서 서비스 간 연계가 필요할 경우, 기하급수적으로 증가하는 연결 루트를 간소화하기 위해 중앙에서 관리하는 것",
    correct: "EAI",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "기업이 보유할 수 있는 모든 지식을 통합 -> 문제 해결 능력 향상하기 위한 것",
    correct: "KMS",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "공급을 관리하는 시스템",
    correct: "SCM",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "고객을 관리하는 시스템",
    correct: "CRM",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "제조 부문에서 자원에 대한 구매/생산을 효율적으로 하기 위한 시스템",
    correct: "ERP",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "제조 부문에서 기업의 의사결정을 돕는 프로세스",
    correct: "BI",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message: "데이터를 설명하는 데이터",
    correct: "메타데이터",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_multi",
    message: "빅데이터 특징 3V (소문자로)",
    correct: ["volume", "variety", "velocity"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_multi",
    message: "3V 에 하나로 추가하는 것은 ___ 또는 ___ 이다. (햔국어로)",
    correct: ["가치", "정확성"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_multi",
    message: "빅데이터가 만들어내는 변화 네 가지",
    correct: ["사후처리", "전수조사", "양", "상관관계"],
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "빅데이터의 역할: 빅데이터는 ____의 석탄, 철! 생산성을 획기적으로 끌어올림.",
    correct: "산업혁명",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "빅데이터의 역할: 빅데이터는 21세기 ___! 산업 전반의 생산성을 향상시키고 새로운 범주의 산업을 만들어낼 것임!",
    correct: "원유",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "빅데이터의 역할: 빅데이터는 ___! 생물학에 큰 영향을 끼친 ___ 처럼 산업 발전에 큰 영향을 줄 것이다.",
    correct: "렌즈",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "빅데이터의 역할: 빅데이터는 ___! (여러 사람이 공동으로 사용 가능한 구조물) 예: 페이스북, 카카오톡",
    correct: "플랫폼",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "___ 이란 헤겔의 변증법에 기초를 둔 개념으로, 양적인 변화가 축적되면 질적인 변화도 이루어진다는 개념이다.",
    correct: "양질 전환의 법칙",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short",
    message:
      "___ 이란 헤겔의 변증법에 기초를 둔 개념으로, 양적인 변화가 축적되면 질적인 변화도 이루어진다는 개념이다.",
    correct: "양질 전환의 법칙",
    category: "1",
    tags: ["1일차"],
  },
  {
    type: "short_order",
    message:
      "빅데이터 가치 산정 어려움의 이유 - 데이터 ___ 방식이 다양해지고, 기존에 없던 ___를 창출함에 따라 산정하기가 어렵고, ___의 발전으로 가치 있는 데이터와 없는 데이터의 경계를 나누기가 어려워졌다.",
    correct: ["활용", "가치", "분석 기술"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_multi",
    message: "미래의 빅데이터 활용에 필요한 3요소",
    correct: ["데이터", "기술", "인력"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_multi",
    message: "7가지 데이터 활용 기본 테크닉",
    correct: [
      "연관규칙 학습",
      "유형분석",
      "유전 알고리즘",
      "기계학습",
      "회귀분석",
      "감정분석",
      "소셜 네트워크 분석",
    ],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중 어떤 변인 간에 주목할 만한 상관 관계가 있는지를 찾아내는 방법",
    correct: "연관규칙 학습",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중 새로운 사건이 속할 범주를 찾아내는 방법",
    correct: "유형분석",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중 최적화가 필요한 문제의 해결책을 자연선택, 돌연변이 등과 같은 메커니즘을 통해 점진적으로 진화시켜 나가는 방법",
    correct: "유전 알고리즘",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중, 컴퓨터가 데이터로부터 규칙을 찾고 이러한 규칙을 활용해 '예측'하는 데 초점을 둔 방법",
    correct: "기계학습",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중, 독립변수를 조작하면서 종속변수가 어떻게 변하는지를 보며 수치형으로 이루어진 두 변인의 관계를 파악하는 방법",
    correct: "회귀분석",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중, 특정 주제에 대해 말하거나 글을 쓴 사람의 감정을 분석하는 방법",
    correct: "감정분석",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "7가지 데이터 활용 기본 테크닉 중, 온라인 공간에서 영향력 있는 사람을 찾아내어 기업의 효율적인 마케팅이나 범죄 수사에서 공범을 찾는 등 다양한 분야에서 활용될 수 있음.",
    correct: "소셜 네트워크 분석",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_multi",
    message: "빅데이터 시대의 위기 요인 세 가지",
    correct: ["사생활 침해", "책임 원칙 훼손", "데이터 오용"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "조지 오웰의 <1984>, SNS에 여행 게시글을 올린 사용자를 대상으로 한 빈집털이 발생과 관련된 빅데이터 위기요인은?",
    correct: "사생활 침해",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "영화 <마이너리티 리포트>, 신용카드 발급 여부 판단에 있어 불이익 발생 등과 관련된 빅데이터 위기요인은?",
    correct: "책임 원칙 훼손",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "잘못된 지표의 사용 등으로 인해 잘못된 인사이트를 얻어 손실을 발생할 수 있다. 포드의 자동차 발명 당시 말(horse)이 이미 유효했던 사실, 스티브 잡스의 아이폰 발명 (이전에는 없었던 창조적인 물건에 대한 미래는 예측하기 힘듬) 등과 관련된 빅데이터 위기요인은?",
    correct: "데이터 오용",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message: "사생활 침해의 통제 방안은 동의에서 ___으로",
    correct: "책임",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message: "책임 원칙 훼손의 통제 방안은 ___ 책임 원칙 고수.",
    correct: "결과 기반",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "데이터가 오용되었을 때에는, 데이터가 어떻게 사용되어 어떠한 이유로 피해자가 발생하게 되었는지 ___ 를 살펴봄으로써 피해자를 구제할 수 있다.",
    correct: "알고리즘",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "___ 이란, 데이터 속에서 개인을 식별할 수 있는 요인을 숨김으로써 개인을 특정할 수 없도록 하는 기술이다.",
    correct: "개인정보 비식별 기술",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_multi",
    message: "데이터 사이언스 구성 요소 세 가지",
    correct: ["Analytics", "IT", "비즈니스 분석"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "다른 이해 관계자들이 보완적인 상품, 서비스를 제공하는 생태계를 구축하고자 하는 비즈니스 모델은 ___ 비즈니스 모델이다.",
    correct: "플랫폼형",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "기업이 부가가치를 생산하는 과정을 통합/세분화하여 시장 상황에 빠르게 대응할 수 있는 비즈니스 모델은 ___ 비즈니스 모델이다.",
    correct: "가치사슬형",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "거래 사이트가 직접 거래하지 않고 공급자와 수요자들이 자유롭게 거래할 수 있도록 하는 비즈니스 모델은 ___ 비즈니스 모델이다.",
    correct: "대리인형",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "다양한 공급자와 수요자들이 만나는 사이트를 운영하는 비즈니스 모델은 ___ 비즈니스 모델이다.",
    correct: "상거래형",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_order",
    message: "빅데이터 가치 패러다임의 변화 세 단계는?",
    correct: ["디지털화", "연결", "에이전시"],
    category: "1",
    tags: ["2일차"],
    weight: 1.5,
  },
  {
    type: "short",
    message:
      "빅데이터 가치 패러다임 중 운영체제, 워드/파워포인트 같은 오피스 프로그램과 같은 것",
    correct: "디지털화",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "빅데이터 가치 패러다임 중 구글의 검색 알고리즘, 네이버의 콘텐츠 등과 관련된 것",
    correct: "연결",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "빅데이터 가치 패러다임 중 복잡한 연결을 얼마나 효과적으로 관리하는 가의 이슈",
    correct: "에이전시",
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "pick_different",
    message: "데이터 사이언스 구성 요소",
    pool: [
      [
        "수학",
        "확률 모델",
        "머신러닝",
        "분석학",
        "패턴 인식과 학습",
        "불확실성 모델링",
      ],
      [
        "시그널 프로세싱",
        "프로그래밍",
        "데이터 엔지니어링",
        "데이터 웨어하우징",
        "고성능 컴퓨팅",
      ],
      ["커뮤니케이션", "프레젠테이션", "스토리텔링", "시각화"],
    ],
    category: "1",
    tags: ["2일차"],
    weight: 2,
  },
  // {
  //   type: "short_multi",
  //   q: "소프트 스킬 세 가지",
  //   correctA: ["통찰력 있는 분석", "설득력 있는 전달", "다분야 간 협력"],
  //   category: "1",
  //   tags: ["2일차"],
  // },
  {
    type: "short_multi",
    message: "소프트 스킬 일곱 가지",
    correct: [
      "호기심",
      "논리적 비판",
      "창의적 사고",
      "창의력",
      "스토리텔링",
      "시각화",
      "커뮤니케이션",
    ],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_order",
    message: "하드 스킬 두 가지: ___에 대한 이론적 지식, ___에 대한 숙련",
    correct: ["빅데이터", "분석 기술"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_multi",
    message: "가트너가 제시한 데이터 사이언티스트 역량 네 가지",
    correct: ["데이터 관리", "분석 모델링", "비즈니스 분석", "소프트 스킬"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short_order",
    message: "외부 환경에서 본 인문학의 열풍: ",
    correct: ["통찰력 있는 분석", "설득력 있는 전달", "다분야간 협력"],
    category: "1",
    tags: ["2일차"],
  },
  {
    type: "short",
    message:
      "추론, 예측, 전망, 추정을 위한 정보의 근거가 될 수 있는 데이터의 특성을 데이터의 ___라고 한다.",
    correct: "당위적 특성",
    category: "1",
  },
  {
    type: "short",
    message:
      "고정된 틀이 존재하지 않고 연산이 불가능하며, 수집과 관리가 어려워 일반적으로 관계형 DB가 아닌 NoSQL DB에 저장되는 데이터는 무엇인가?",
    correct: "비정형 데이터",
    category: "1",
  },
  {
    type: "short",
    message:
      "학습과 체험을 통해 개인에게 습득되어 있지만 겉으로 드러나지 않는 상태의 지식. 문자나 언어로 나타나지 않음.",
    correct: "암묵지",
    category: "1",
  },
  {
    type: "short_order",
    message:
      "개인에게 내면화된 암묵지가 조직의 지식으로 ___되기 위해서는, 표출화하고 이를 다시 개인의 지식으로 ___ 하는 과정을 거치게 된다.",
    correct: ["공통화", "연결화"],
    category: "1",
  },
  {
    type: "short",
    message:
      "체계적으로 수집, 축적하여 다양한 용도와 방법으로 이용할 수 있게 정리한 정보의 집합체",
    correct: "DB",
    category: "1",
  },
  {
    type: "short",
    message: "이용자가 쉽게 DB를 구축, 유지할 수 있게 하는 관리 소프트웨어는?",
    correct: "DBMS",
    category: "1",
  },
  {
    type: "short",
    message:
      "대량의 정보를 일정한 형식에 따라 컴퓨터 등의 정보처리기기가 읽고 쓸 수 있는 DB의 특성",
    correct: "기계 가독성",
    category: "1",
  },
  {
    type: "short",
    message: "온라인으로 이용 가능한 DB의 특성",
    correct: "원격 조작성",
    category: "1",
  },
  {
    type: "short",
    message:
      "제품의 설계, 개발, 생산, 유통, 폐기에 이르기까지 제품의 라이프사이클 전반에 관련된 데이터를 통합하고 공유/교환할 수 있게 한 경영통합정보시스템",
    correct: "CALS",
    category: "1",
  },
  {
    type: "short",
    message:
      "학사 뿐 아니라 기타 교육행정 전 업무를 처리하는 시스템으로, 교육부 아래 각 시도별 교육청과 교육지원청들, 그리고 약 1만여 곳의 학교를 연계하는 대형 네트워크 시스템은?",
    correct: "NEIS",
    category: "1",
  },
  {
    type: "short_multi",
    message: "더그 래니의 3V에 추가된 4V 모두 쓰시오 (소문자 영어로)",
    correct: ["value", "veracity", "visualization", "variability"],
    category: "1",
  },
  {
    type: "short",
    message:
      "데이터가 어떻게 사용되어 어떠한 이유로 피해자가 발생하게 되었는지 데이터 활용 로직인 알고리즘을 살펴보는 전문 인력",
    correct: "알고리즈미스트",
    category: "1",
  },
  {
    type: "short",
    message:
      "다음 상황에서 분석 주제는? 분석 대상이 무엇인지 알고 있음, 분석 방법을 알고 있음.",
    correct: "최적화",
    category: "2",
  },
  {
    type: "short",
    message:
      "다음 상황에서 분석 주제는? 분석 대상이 무엇인지 알고 있음, 분석 방법을 모름.",
    correct: "솔루션",
    category: "2",
  },
  {
    type: "short",
    message:
      "다음 상황에서 분석 주제는? 분석 대상이 무엇인지 모름, 분석 방법을 알고 있음.",
    correct: "발견",
    category: "2",
  },
  {
    type: "short",
    message:
      "다음 상황에서 분석 주제는? 분석 대상이 무엇인지 모름, 분석 방법을 모름.",
    correct: "통찰",
    category: "2",
  },
  {
    type: "short_multi",
    message: "기업의 합리적 의사 결정을 방해하는 세 가지",
    correct: ["고정 관념", "편향된 생각", "프레이밍 효과"],
    category: "2",
  },
  {
    type: "short_multi",
    message: "비즈니스 모델 탐색 기법에서 5가지로 단순화한 것들",
    correct: ["규제와 감사", "업무", "제품", "고객", "지원 인프라"],
    category: "2",
  },
  {
    type: "short_order",
    message: "분석 과제 발굴시, 하향식 접근법 4단계 차례대로",
    correct: ["문제 탐색", "문제 정의", "해결 방안 탐색", "타당성 검토"],
    category: "2",
  },
  {
    type: "short_order",
    message:
      "분석 기회 발굴 범위 확장할 때의 4가지 영역: ___ 관점(문제 혹은 변화가 기업에 주는 영향 탐색), ___ 확대 관점(위협이 될 상황), ___ 탐색, ___의 재해석(기업 내부를 둘러보기)",
    correct: ["거시적", "경쟁자", "시장의 니즈", "역량"],
    category: "2",
    weight: 2,
  },
  {
    type: "short",
    message:
      "분석 과제 발굴 - 문제 탐색시, 분석을 적용했을 떄 업무 흐름을 개념적으로 설명한 것. 유사, 동종 업계의 탐색으로부터 정의됨",
    correct: "분석 유스케이스",
    category: "2",
  },
  {
    type: "short_order",
    message:
      "분석 과제 발굴 - 하향식 접근법 - 타당성 검토 단계에서의 두 가지 유형: ___ 타당성, ___ 및 ___ 타당성",
    correct: ["경제적", "데이터", "기술적"],
    category: "2",
  },
  {
    type: "short",
    message:
      "더블 다이아몬드, 발산과 수렴 단계를 거쳐 혁신적인 아이디어를 도출하는 방식은?",
    correct: "디자인씽킹",
    category: "2",
  },
  {
    type: "short",
    message: "정답이 있는 데이터로 분석 모델을 학습시키는 것",
    correct: "지도학습",
    category: "2",
  },
  {
    type: "short",
    message: "정답이 없는 데이터로 분석 모델을 학습시키는 것",
    correct: "비지도학습",
    category: "2",
  },
  {
    type: "short",
    message:
      "___ 접근법: 먼저 분석을 시도하고 그 결과를 확인하면서 조금씩 개선해나가는 방법",
    correct: "프로토타이핑",
    category: "2",
  },
  {
    type: "short",
    message:
      "분석 과제를 발굴한 후 작성하는 문서. 분석의 정의, 범위, 방법 등을 기술",
    correct: "분석과제 정의서",
    category: "2",
  },
  {
    type: "short_order",
    message: "빅데이터 분석 방법론 차례대로 5단계(Phase)",
    correct: [
      "분석 기획",
      "데이터 준비",
      "데이터 분석",
      "시스템 구현",
      "평가 및 전개",
    ],
    category: "2",
    weight: 2,
  },
  {
    type: "short_order",
    message:
      "빅데이터 분석 방법론 - 1단계 분석 기획에서의 태스크: 비즈니스 ___ 및 ___ 설정, 프로젝트 ___ 및 ___ 수립, 프로젝트 ___ 계획 수립",
    correct: ["이해", "범위", "정의", "계획", "위험"],
    category: "2",
  },
  {
    type: "short_order",
    message:
      "목표 시점별 분석 기획 - ___ 중심적인 방식(빠르게 해결해야 하는 경우), ___ 방식 (지속적인 분석 내재화를 위한 경우)",
    correct: ["과제", "마스터플랜"],
    category: "2",
  },
  {
    type: "short_order",
    message:
      "빅데이터 분석 방법론 - 데이터 준비에서의 태스크: 필요한 ___ 정의, ___ 설계, 데이터 ___ 및 ___ 검정",
    correct: ["데이터", "데이터 스토어", "수집", "정합성"],
    category: "2",
  },
  {
    type: "short_order",
    message:
      "빅데이터 분석 방법론 - 데이터 분석에서의 태스크: 분석용 데이터 준비, ___ 분석, ___ 분석, ___, ___ 평가 및 검증",
    correct: ["텍스트", "탐색적", "모델링", "모델"],
    category: "2",
  },
  {
    type: "short_order",
    message:
      "빅데이터 분석 방법론 - 4단계: ___(A) 구현 에서의 태스크: 설계 및 구현, (A) ___ 및 ___ ",
    correct: ["시스템", "테스트", "운영"],
    category: "2",
  },
  {
    type: "short_order",
    message:
      "빅데이터 분석 방법론 - 5단계: ___ 및 ___: 모델 ___, 프로젝트 평가 및 보고",
    correct: ["평가", "전개", "발전 계획"],
    category: "2",
  },
  {
    type: "short",
    message:
      "전통적인 분석 방법론 중 ___ 분석 방법론은 데이터로부터 통계적 패전이나 지식을 찾기 위해 체계적으로 정리한 데이터 마이닝 프로세스이다.",
    correct: "KDD",
    category: "2",
  },
  {
    type: "short",
    message:
      "전통적인 분석 방법론 중 ___ 분석 방법론은 4개의 레벨과 6개의 단계로 구성되어 있다. (좀 더 세분화가 되어 있다.)",
    correct: "CRISP-DM",
    category: "2",
  },
  {
    type: "short",
    message:
      "프로젝트를 수행할 때 여러 개의 작은 업무 단위로 분해하고, 각각의 분해된 업무 담당자 및 수행 기간을 정의한 것은?",
    correct: "업무분업구조",
    category: "2",
  },
  {
    type: "short",
    message:
      "분석 방법론에서, 반복을 통해 점증적으로 개발하는 모델은 ___ 모델이다. 사용자의 요구에 초점을 맞춤",
    correct: "프로토타입",
    category: "2",
  },
  {
    type: "short",
    message:
      "분석 방법론에서, 반복을 통해 점증적으로 개발하는 모델은 ___ 모델이다. 사용자의 요구보다는 위험요소를 사전에 제거한다는 것에 초점을 맞춘다.",
    correct: "나선형",
    category: "2",
  },
  {
    type: "short",
    message: "모델 성능 측정 시, 모델과 실제 값 간의 차이가 적다는 척도는?",
    correct: "정확도",
    category: "2",
  },
  {
    type: "short",
    message:
      "모델 성능 측정 시, 반복적으로 모델을 사용했을 때 모델 값들의 편차 수준을 나타내는 것은?",
    correct: "정밀도",
    category: "2",
  },
  {
    type: "short_order",
    message:
      "분석 마스터플랜 수립 시 분서과제의 우선 순위를 정할 때 그 기준 네 가지: ___ 중요도, ___ 성과, ___, 분석과제의 ___ 용이성",
    correct: ["전략적", "비즈니스", "ROI", "실행"],
    category: "2",
    weight: 2,
  },
  {
    type: "short_order",
    message:
      "기업 분류: ___형: 낮은 준비도, 낮은 성숙도 / ___형: 낮은 준비도, 높은 성숙도 / ___형: 높은 준비도, 높은 성숙도 / ___형: 높은 준비도, 낮은 성숙도",
    correct: ["준비", "정착", "확산", "도입"],
    category: "2",
    weight: 2,
  },
  {
    type: "short",
    message:
      "데이터 분석 조직 유형 중 ___ 조직 구조는, 조직 내 독립적인 분석 전담 조직을 구성하고, 회사의 모든 분석 업무를 전담 조직에서 담당하는 것. 일부 협업 부서와 업무가 중복될 수 있음.",
    correct: "집중형",
    category: "2",
  },
  {
    type: "short",
    message:
      "데이터 분석 조직 유형 중 ___ 조직 구조는, 각 해당 업무 부서에서 직접 분석하는 형태. 전사적 관점에서 핵심 분석이 어려움.",
    correct: "기능 중심",
    category: "2",
  },
  {
    type: "short",
    message:
      "데이터 분석 조직 유형 중 ___ 조직 구조는, 분석 조직의 인력을 현업 부서에 배치함. 전사 차원에서 관리가 가능하고 분석 결과를 실무에 빠르게 적용 가능함",
    correct: "분산형",
    category: "2",
  },
  {
    type: "short",
    message:
      "데이터 웨어하우스로부터 특정 사용자가 관심을 갖는 데이터들을 주제별, 부서별로 추출하여 모은 비교적 작은 규모의 데이터 웨어하우스를 무엇이라 하는가?",
    correct: "데이터 마트",
    category: "3",
  },
  {
    type: "short",
    message:
      "데이터 웨어하우스로부터 특정 사용자가 관심을 갖는 데이터들을 주제별, 부서별로 추출하여 모은 비교적 작은 규모의 데이터 웨어하우스를 무엇이라 하는가?",
    correct: "데이터 마트",
    category: "3",
  },
  {
    type: "short",
    message:
      "데이터 ___란, 데이터 마트를 개발한 후 데이터를 정제하고 분석 변수를 처리하는 과정이다. 빅데이터 분석 단계에 들어가기 전 필요하다. ",
    correct: "전처리",
    category: "3",
  },
  {
    type: "short",
    message: "데이터로부터 기본적인 통계 자료를 추출한 변수는?",
    correct: "요약변수",
    category: "3",
  },
  {
    type: "short",
    message:
      "범용으로 활용되는 기본적인 통계자료가 아닌, 특정한 목적을 갖고 조건을 만족하는 변수들을 새롭게 생성한 것",
    correct: "파생변수",
    category: "3",
  },
  {
    type: "short",
    message: "존재하지 않는 데이터",
    correct: "결측값",
    category: "3",
  },
  {
    type: "short",
    message:
      "결측값이 존재하는 데이터를 삭제하는 방법 중 결측값을 단순히 삭제하는 방법은?",
    correct: "단순대치법",
    category: "3",
  },
  {
    type: "short",
    message:
      "결측값이 존재하는 데이터를 삭제하는 방법 중 평균 혹은 중앙값으로 결측값을 대치하여 불완전한 자료를 완전한 자료로 만드는 방법은?",
    correct: "평균대치법",
    category: "3",
  },
  {
    type: "short",
    message: "다른 데이터와 달리 극단적으로 크거나 작은 값을 의미하는 것은?",
    correct: "이상값",
    category: "3",
  },
  {
    type: "short",
    message:
      "평균으로부터 표준편차 3 만큼 떨어진 값들을 이상값으로 인식하는 방법은?",
    correct: "ESD",
    category: "3",
  },
  {
    type: "short",
    message:
      "모집단의 원소에 차례대로 번호 부여한 후 일정한 간격을 두고 데이터를 추출하는 방법",
    correct: "계통추출법",
    category: "3",
  },
  {
    type: "short",
    message:
      "여러 그룹으로 나눈 것 중 랜덤으로 선택하는 방법. 단, 그룹 간엔 동질적이며 그룹 내 데이터는 서로 이질적이다.",
    correct: "집락추출법",
    category: "3",
  },
  {
    type: "short",
    message:
      "여러 그룹으로 나눈 것 중 랜덤으로 선택하는 방법. 단, 그룹 간엔 이질적이며 그룹 내 데이터는 서로 동질적이다.",
    correct: "층화추출법",
    category: "3",
  },
  {
    type: "short",
    message: "측정 대상이 어느 집단에 속하는지 나타내는 자료",
    correct: "명목척도",
    category: "3",
  },
  {
    type: "short",
    message: "측정 대상이 명목척도이면서 순서가 있는 자료",
    correct: "서열척도",
    category: "3",
  },
  {
    type: "short",
    message: "양을 측정할 수 있으며, 두 구간 사이에 의미가 있는 자료",
    correct: "구간척도",
    category: "3",
  },
  {
    type: "short",
    message:
      "측정 대상이 구간척도이면서 절대적 기준 0이 존재하여 사칙연산이 가능한 자료",
    correct: "비율척도",
    category: "3",
  },
  {
    type: "short",
    message: "표본에서 얻은 통계치를 바탕으로 모수를 추정하는 통계 기법",
    correct: "추리통계",
    category: "3",
  },
  {
    type: "short",
    message: "표본에서 얻은 통계치를 바탕으로 모수를 추정하는 통계 기법",
    correct: "추리통계",
    category: "3",
  },
  {
    type: "short",
    message: "교집합이 없는 사건",
    correct: "배반사건",
    category: "3",
  },
  {
    type: "short",
    message: "서로 영향을 주지 않는 두 개의 사건은 서로 ___ 이다.",
    correct: "독립",
    category: "3",
  },
  {
    type: "short",
    message: "___ 분포: 성공/실패로 나뉘어지는 시행에서, 성공 확률이 p인 분포",
    correct: "베르누이",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 분포: 성공/실패로 나뉘어지는 n번의 베르누이 시행에서, 성공 확률이 p일 때, k번 성공할 확률의 분포",
    correct: "이항",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 분포: 성공 확률이 p인 베르누이 시행에서 처음으로 성공이 나올 때까지 k번 실패할 확률의 분포",
    correct: "기하",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 분포: n번의 베르누이 시행에서 각 시행이 3개 이상의 결과를 가질 수 있는 확률의 분포",
    correct: "다항",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 분포: 단위시간 혹은 단위공간 내에서 발생할 수 있는 사건의 발생 횟수에 대한 확률 분포",
    correct: "푸아송",
    category: "3",
  },
  {
    type: "short",
    message: "___ 분포: 연속형에서 모든 값에 대하여 같은 확률을 갖고 있는 분포",
    correct: "균일",
    category: "3",
  },
  {
    type: "short",
    message: "___분포: 평균이 μ이고, 표준편차가 𝜎인 분포",
    correct: "정규",
    category: "3",
  },
  {
    type: "short",
    message:
      "표준정규분포를 따르는 확률변수 Z_1, Z_2, ..., Z_n의 제곱 합 X 는 자유도가 n인 ___ 분포를 따른다.",
    correct: "카이제곱",
    category: "3",
  },
  {
    type: "short",
    message:
      "서로 독립인 두 카이제곱 분포를 따르는 확률변수 V_1 ~ X^2(k_1), V_2 ~ X^2(k_2)를 각각의 자유도로 나누었을 때 서로의 비율 X 는 자유도가 k_1, k_2인 ___ 분포를 따른다.",
    correct: "F",
    category: "3",
  },
  {
    type: "short",
    message: "귀무가설(H_0)이 사실인데 틀렸다고 결정(기각)하는 오류",
    correct: "제1종 오류",
    category: "3",
  },
  {
    type: "short",
    message: "귀무가설(H_0)이 거짓인데 옳다고 결정(채택)하는 오류",
    correct: "제2종 오류",
    category: "3",
  },
  {
    type: "short",
    message:
      "실험과 연구를 통해 기각하고자 하는 가설. 이것의 기각을 통해 입증하고자 하는 주장을 관철할 수 있음.",
    correct: "귀무가설",
    category: "3",
  },
  {
    type: "short",
    message: "귀무가설이 틀렸다고 판단될 경우 채택될 가설",
    correct: "대립가설",
    category: "3",
  },
  {
    type: "short",
    message:
      "귀무가설을 판단하기 위해서, 표본조사를 실시하였을 떄 특정 수식에 의하여 포본들로부터 얻을 수 있는 값",
    correct: "검정통계량",
    category: "3",
  },
  {
    type: "short",
    message: "모수가 특정한 구간 안에 존재할 것이라 예상하는 것",
    correct: "구간추정",
    category: "3",
  },
  {
    type: "short",
    message: "모수를 추정할 때 하나의 특정한 값이라 추정하는 것",
    correct: "점추정",
    category: "3",
  },
  {
    type: "short",
    message: "어느 한 쪽으로 편향되지 않아서 모수를 추정하기에 이상적인 값",
    correct: "불편추정량",
    category: "3",
  },
  {
    type: "short",
    message: "확률분포의 뾰족한 정도",
    correct: "첨도",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "___(A)는 확률 분포의 비대칭 정도를 나타내는 척도이며, A가 0보다 __면 최빈값 < 중앙값 < 평균이다.",
    correct: ["왜도", "크다"],
    category: "3",
  },
  {
    type: "short",
    message: "어떤 확률변수가 취할 수 있는 값의 평균 값",
    correct: "기댓값",
    category: "3",
  },
  {
    type: "short",
    message: "데이터들이 중심에서 얼마나 떨어져 있는지를 알아보기 위한 측도",
    correct: "분산",
    category: "3",
  },
  {
    type: "short",
    message:
      "귀무가설이 참인데도 이를 잘못 기각하는 오류를 범할 확률의 최대 허용 한계",
    correct: "유의수준",
    category: "3",
  },
  {
    type: "short",
    message: "귀무가설을 지지하는 정도. 대립가설이 우연히 나올 확률.",
    correct: "유의확률",
    category: "3",
  },
  {
    type: "short",
    message:
      "세 개 이상의 모집단이 있을 때 여러 집단 사이의 평균을 비교하는 검정 방법",
    correct: "분산분석",
    category: "3",
  },
  {
    type: "short_multi",
    message: "분산분석을 위한 세 가지 조건은?",
    correct: ["정규성", "등분산성", "독립성"],
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 검정: 실험 결과 얻어진 관측값이 예상값과 일치하는지 여부를 검정하는 방법이다.",
    correct: "적합도",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 검정: 모집단이 두 개의 변수에 의해 범주화됐을 때 그 두 변수들 사이의 관계가 독립적인지 아닌지 검정하는 것",
    correct: "독립성",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 검정: 관측값들이 정해진 범주 내에서 서로 비슷하게 나타나고 있는지를 검정하는 것",
    correct: "동질성",
    category: "3",
  },
  {
    type: "short",
    message:
      "모집단의 분포와 상관없이 표본의 개수가 커질 수록 표본평균의 분포는 정규분포에 가까워지는 현상",
    correct: "중심극한정리",
    category: "3",
  },
  {
    type: "short",
    message: "두 변수 간의 선형적 관계가 존재하는지 알아보는 분석 방법",
    correct: "상관분석",
    category: "3",
  },
  {
    type: "short",
    message:
      "상관분석에서 측정된 두 변수가 등간척도 혹은 비율척도일 때 사용하는 것은?",
    correct: "피어슨 상관계수",
    category: "3",
  },
  {
    type: "short",
    message: "상관분석에서 측정된 두 변수가 서열척도일 때 사용하는 것은?",
    correct: "스피어만 상관계수",
    category: "3",
  },
  {
    type: "short",
    message: "상관분석의 귀무가설은 '두 변수 간에 상관관계가 ___' 이다.",
    correct: "없다",
    category: "3",
  },
  {
    type: "short",
    message:
      "___이란, 하나 이상의 독립변수들이 종속변수에 얼마나 영향을 미치는지 추정하는 통계기법이다.",
    correct: "회귀분석",
    category: "3",
  },
  {
    type: "short_multi",
    message: "회귀분석의 가정 다섯 가지",
    correct: ["선형성", "독립성", "등분산성", "정규성", "비상관성"],
    category: "3",
  },
  {
    type: "short",
    message:
      "___이란, 실제 관측치와 추세선에 의해 예측된 점 사이의 거리, 즉 오차를 제곱해 더한 값을 최소화하는 것.",
    correct: "최소제곱법",
    category: "3",
  },
  {
    type: "short",
    message: "회귀모형의 통계적 유의성은 ___ 를 통해 확인한다.",
    correct: "F 검정",
    category: "3",
  },
  {
    type: "short",
    message:
      "회귀모형의 ___ 이 좋다는 말은 데이터들의 분포가 회귀선에 밀접하게 분포하고 있다는 의미이다.",
    correct: "설명력",
    category: "3",
  },
  {
    type: "short",
    message: "표본집단에 의한 회귀식과 관측값 사이에 나타나는 차이",
    correct: "잔차",
    category: "3",
  },
  {
    type: "short",
    message: "모집단에 의한 회귀식과 관측값 사이에 나타나는 차이",
    correct: "오차",
    category: "3",
  },
  {
    type: "short",
    message: "독립변수 간 강한 상관관계가 나타나는 문제",
    correct: "다중공선성",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "___ 값을 구해서 이게 ___ 를 넘는다면 보통 다중공선성이 있다고 판단할 수 있다.",
    correct: ["분산팽창요인", "10"],
    category: "3",
  },
  {
    type: "short",
    message: "독립변수 간 강한 상관관계가 나타나는 문제",
    correct: "다중공선성",
    category: "3",
  },
  {
    type: "short",
    message:
      "회귀모형의 성능지표로서, MSE에 변수 수 만큼 페널티를 주는 지표는?",
    correct: "AIC",
    category: "3",
  },
  {
    type: "short",
    message:
      "회귀모형의 성능지표로서, AIC의 단점인, 표본이 커질 때 부정확하다는 단점을 보완한 지표는?",
    correct: "BIC",
    category: "3",
  },
  {
    type: "short",
    message:
      "최소제곱법으로 사용하여 추정된 회귀모형의 적합성을 평가하는 데 사용된다.",
    correct: "멜로우 Cp",
    category: "3",
  },
  {
    type: "short",
    message:
      "회귀분석 시 변수 선택에 있어 기준 통계치에 가장 영향을 많이 줄 것으로 판단되는 변수부터 하나씩 추가하면서 모형을 선택하는 것",
    correct: "전진선택법",
    category: "3",
  },
  {
    type: "short",
    message:
      "회귀분석 시 변수 선택에 있어 가장 영향을 적게 주는 것부터 하나씩 제거하면서 모형을 선택하는 것",
    correct: "후진제거법",
    category: "3",
  },
  {
    type: "short",
    message:
      "변수를 추가하면서 추가될 때 예상되는 벌점 값과 이미 추가된 변수가 제거될 때 예상되는 벌점 값이 가장 작도록 만들어나가는 방법",
    correct: "단계별 방법",
    category: "3",
  },
  {
    type: "short",
    message: "모델이 학습 데이터를 과하게 학습하는 것",
    correct: "과적합",
    category: "3",
  },
  {
    type: "short",
    message: "모델이 너무 단순하여 학습 데이터조차 제대로 예측하지 못하는 경우",
    correct: "과소적합",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "회귀분석에서 과적합되면 계수의 크기도 ___ 하게 된다. 따라서 이를 방지하기 위해 ___ 를 사용한다.",
    correct: ["과도", "정규화 선형회귀"],
    category: "3",
  },
  {
    type: "short",
    message:
      "가중치들의 절댓값의 합을 최소화하는 것을 제약조건으로 추가하는 방법",
    correct: "라쏘",
    category: "3",
  },
  {
    type: "short",
    message:
      "가중치들의 제곱의 합을 최소화하는 것을 제약조건으로 추가하는 방법",
    correct: "릿지",
    category: "3",
  },
  {
    type: "short",
    message:
      "가중치들의 절댓값의 합과 제곱의 합을 최소화하는 것을 제약조건으로 추가하는 방법",
    correct: "엘라스틱넷",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 회귀는 종속변수가 범주형 변수(사망/생존, 0/1)인 경우에 사용한다.",
    correct: "로지스틱",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 회귀는 종속변수가 특정 시간 동안 발생한 사건의 건수에 대한 도수 자료인 경우면서, 정규분포를 따르지 않거나 등분산성을 만족하지 못하는 경우 사용된다.",
    correct: "푸아송",
    category: "3",
  },
  {
    type: "short",
    message: "회귀분석에 있어 자기상관성이 존재하는지 검정하는 방법",
    correct: "더빈 왓슨 검정",
    category: "3",
  },
  {
    type: "short",
    message:
      "다차원 척도법에서는 개체의 실제 거리와 모형에 의해 추정된 거리 사이의 적합도를 측정하기 위해 ___ 척도를 사용한다.",
    correct: "stress",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "___ 이란, 여러 개의 변수 중 서로 상관성이 높은 변수들의 ___으로 새로운 변수를 만들어 기존 변수를 요약 및 축소하는 분석 방법이다.",
    correct: ["주성분분석", "선형결합"],
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 은, x축을 성분의 개수, y축을 고윳값으로 하는 그래프로 주성분의 개수를 선택하는 데 도움을 준다.",
    correct: "scree plot",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 이란 두 개의 확률 변수의 선형관계를 나타낸다. 하나의 확률 변수의 증감에 따른 다른 확률 변수의 증감 경향에 대한 측도이다. 대부분의 시계열 자료들은 이것이 0이 아니다.",
    correct: "공분산",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "시계열 자료의 정상성 조건 중 평균은 ___ 해야 한다. 만약 그렇지 않다면 ___을 통해 정상화할 수 있다.",
    correct: ["일정", "차분"],
    category: "3",
  },
  {
    type: "short",
    message:
      "시계열 자료의 정상성 조건 중 ___ 은 일정해야 한다. 그렇지 않다면 변환을 통해 정상화할 수 있다.",
    correct: "분산",
    category: "3",
  },
  {
    type: "short_order",
    message: "시계열 자료의 정상성 조건 중 ___ 은 ___ 에만 의존해야 한다.",
    correct: ["공분산", "시차"],
    category: "3",
  },
  {
    type: "short",
    message:
      "시계열 분석 기법 중, 최근 자료가 과거 자료보다 예측에 효과적이라는 가정 하에 최근 데이터일수록 큰 가중치를 부여하는 식으로 평균을 계산하는 방법",
    correct: "지수평활법",
    category: "3",
  },
  {
    type: "short",
    message:
      "현재 시점이 이전 시점과의 상관관계가 존재하지 않는 서로 독립적인 시계열 자료를 뜻하는 것은?",
    correct: "백색잡음",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 모형: 시계열 모형 중 t라는 시점에서의 값 y_i는 이전 시점들 n개에 의해 설명될 수 있음을 의미하는 것은?",
    correct: "자기회귀",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 모형: 시계열 모형 중 이전 시점의 백색잡음들의 선형결합으로 표현하는 것은?",
    correct: "이동평균",
    category: "3",
  },
  {
    type: "short",
    message: "___ 모형: 비정상 시계열 자료를 다룰 수 있는 모형은?",
    correct: "자기회귀누적이동평균",
    category: "3",
  },
  {
    type: "short",
    message:
      "시계열은 다양한 요인으로 구성되며, 분석 목적에 따라 특정 요인만 분리해 분석하거나 제거하는 작업을 뜻하는 것은?",
    correct: "분해시계열",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "___용 데이터는 모델을 구축하기 위해 활용되며, ___용 데이터는 구축된 모델이 적합한지 검증하고 모형의 과대추정 및 과소추정을 방지하기 위해 활용되며, ___용 데이터는 최종적으로 구축된 모델의 성능을 평가하기 위함이다.",
    correct: ["훈련", "검정", "평가"],
    category: "3",
  },
  {
    type: "short",
    message:
      "___은 가장 보편적인 데이터 분할을 통한 검증 방법으로서 전체 데이터를 랜덤하게 추출해 학습 데이터과 테스트 데이터로 분리하는 방식이다.",
    correct: "홀드아웃",
    category: "3",
  },
  {
    type: "short",
    message:
      "___은 전체 데이터 셋을 k개의 집단으로 구분한 뒤 그 중 하나를 평가용으로, 나머지를 훈련용으로 사용하는 모델 k개를 만들어 종합하여 최종 모델을 구축하는 방법이다.",
    correct: "k-Fold 교차검증",
    category: "3",
  },
  {
    type: "short",
    message:
      "___은 표본의 개수만큼 표본에서 다시 추출하는 방법의 일종이다. 복원추출을 하기 때문에 중복 추출이 허용된다.",
    correct: "붓스트랩",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 은 각 영역이 가지는 레이블의 분포가 유사하도록 영역을 추출해 교차검증을 실시한다. 주로 불균형 데이터를 분류하는 문제에서 사용된다.",
    correct: "계층별 k-Fold 교차검증",
    category: "3",
  },
  {
    type: "short",
    message: "___란 성공할 확률이 실패할 확률의 몇 배인지를 나타내는 값이다.",
    correct: "오즈",
    category: "3",
  },
  {
    type: "short",
    message:
      "로지스틱 회귀분석에서 독립변수가 범주형일 경우에는, 독립변수를 ___변수로 변환하면 가능하다.",
    correct: "더미",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "오즈의 단점은 ___를 가질 수 없고 확률값과 오즈의 그래프는 ___을 띤다. 그래서 ___ 는 오즈에 로그값을 취한다.",
    correct: ["음수", "비대칭성", "로짓"],
    category: "3",
  },
  {
    type: "short_order",
    message:
      "오즈의 단점은 ___를 가질 수 없고 확률값과 오즈의 그래프는 ___을 띤다. 그래서 ___ 는 오즈에 로그값을 취한다.",
    correct: ["음수", "비대칭성", "로짓"],
    category: "3",
  },
  {
    type: "short",
    message: "의사결정나무는 분리 기준으로 ___ 를 사용한다.",
    correct: "불순도",
    category: "3",
  },
  {
    type: "short",
    message:
      "의사결정나무가 너무 많은 분리 기준을 가지고 있으면 해석이 어렵기 때문에, 특정 조건 하에 현재의 마디에서 더이상 분리가 일어나지 않게 하는 것은?",
    correct: "정지규칙",
    category: "3",
  },
  {
    type: "short_multi",
    message: "지니계수 계산법: 각 ___ 의 ___ 들을 합한 것을 ___ 에서 뺀다.",
    correct: ["확률", "제곱", "1"],
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 이란, 모형의 예측력을 높이고자 여러 번의 데이터 분할을 통하여 구축된 다수의 모형을 결합하여 새로운 모형을 만드는 방법이다.",
    correct: "앙상블분석",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 이란, 앙상블분석 중 하나로서, 여러 개의 붓스트랩을 집계하는 알고리즘이다. 여러 분류기에 의한 결과를 놓고 다수결에 의하여 최종 결괏값을 선정(보팅)한다.",
    correct: "배깅",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 이란, 이전 모델을 구축한 뒤 다음 모델을 구축할 때 이전 분류기에 의해 잘못 분류된 데이터에 더 큰 가중치를 주어 붓스트랩을 구성한다.",
    correct: "부스팅",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 이란, 많은 무작위성으로 생성된 서로 다른 여러 개의 트리를 이용하여, 일반화의 성능을 향상시킬 수 있다.",
    correct: "랜덤포레스트",
    category: "3",
  },
  {
    type: "short_multi",
    message: "인공신경망은 세 가지의 층으로 구성된다.",
    correct: ["입력층", "은닉층", "출력층"],
    category: "3",
  },
  {
    type: "pick",
    correct: "비선형적",
    message: "인공신경망은 ___인 문제를 분석하는 데 유용하다.",
    wrongs: ["선형적"],
  },
  {
    type: "short",
    message:
      "___ 이란, 인공신경망의 출력값과 실제값의 오차가 최소가 되는 가중치와 편향을 찾는 알고리즘이다.",
    correct: "역전파 알고리즘",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 알고리즘이란, 정답 라벨이 있는 데이터들 속에서 정답 라벨이 없는 데이터들을 어떻게 분류할 것인지에 대한 해결 방법으로 사용된다.",
    correct: "k-NN",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 이론이란, 사전확률과 우도확률을 통해 사후확률을 추정하는 것과 관련된 이론이다. 주관적으로 확률을 해석한다.",
    correct: "베이즈",
    category: "3",
  },
  {
    type: "short",
    message: "___ 분류는 스팸 메일 필터링, 텍스트 분류 등에 사용할 수 있다.",
    correct: "나이브 베이즈",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 알고리즘은 초평면을 이용하여 카테고리를 나누어 비확률적 이진 선형모델을 만든다. 지도학습에 주로 이용되며 특히 분류 성능이 뛰어나다.",
    correct: "SVM",
    category: "3",
  },
  {
    type: "short",
    message: "전체 관측치 중 올바르게 예측한 비율",
    correct: "정분류율",
    category: "3",
  },
  {
    type: "short",
    message: "(TP+TN)/(TP+TN+FP+FN)",
    correct: "정분류율",
    category: "3",
  },
  {
    type: "short",
    message: "전체 관측치 중 잘못 예측한 비율",
    correct: "오분류율",
    category: "3",
  },
  {
    type: "short",
    message: "(FP+FN)/(TP+TN+FP+FN)",
    correct: "오분류율",
    category: "3",
  },
  {
    type: "short_multi",
    message: "실제 TRUE 중 올바른 TRUE를 찾아낸 비율. (두 가지 이름)",
    correct: ["민감도", "재현율"],
    category: "3",
  },
  {
    type: "short_multi",
    message: "TP/(TP+FN) (두 가지 이름)",
    correct: ["민감도", "재현율"],
    category: "3",
  },
  {
    type: "short",
    message: "실제 FALSE 중 올바른 FALSE를 찾아낸 비율",
    correct: "특이도",
    category: "3",
  },
  {
    type: "short",
    message: "TN/(TN+FP)",
    correct: "특이도",
    category: "3",
  },
  {
    type: "short",
    message: "예측 TRUE 중 올바르게 TRUE를 찾아낸 비율",
    correct: "정밀도",
    category: "3",
  },
  {
    type: "short",
    message: "TP/(TP+FP)",
    correct: "정밀도",
    category: "3",
  },
  {
    type: "short",
    message: "정밀도와 재현율의 조화평균 값으로, 값이 높을 수록 좋다.",
    correct: "F1 Score",
    category: "3",
  },
  {
    type: "short_order",
    message:
      "___ 란, 분류 분석 모형의 평가를 쉽게 비교할 수 있도록 시각화한 그래프로서, x 축에는 ___, y 축은 ___ 이고 아래 면적이 ___에 가까울 수록 성능이 우수하다.",
    correct: ["ROC 곡선", "FPR", "민감도", "1"],
    category: "3",
  },
  {
    type: "short",
    message:
      "거리 측도 중 두 점 사이의 가장 짧은 거리는? (가장 일반적으로 사용됨)",
    correct: "유클리디안 거리",
    category: "3",
  },
  {
    type: "short",
    message: "거리 측도 중 변수들 차이의 단순한 합으로 구한 것은?",
    correct: "맨하탄 거리",
    category: "3",
  },
  {
    type: "short",
    message: "변수 간 거리 차이 중 최댓값을 취한 것은?",
    correct: "체비셰프 거리",
    category: "3",
  },
  {
    type: "short",
    message:
      "가장 가까운 거리를 가지는 관측치부터 결합해나가면서 계층적 트리 구조를 형성하고, 이를 통해 군집화를 수행하는 방법은?",
    correct: "계층적 군집분석",
    category: "3",
  },
  {
    type: "short",
    message: "군집 간 거리 측정 시, 가장 가까운 데이터끼리 계산하는 방법",
    correct: "단일연결법",
    category: "3",
  },
  {
    type: "short",
    message: "군집 간 거리 측정 시, 가장 먼 데이터끼리 계산하는 방법",
    correct: "완전연결법",
    category: "3",
  },
  {
    type: "short",
    message:
      "군집 간 거리 측정 시, 데이터 간의 모든 거리를 평균내어 계산하는 방법",
    correct: "평균연결법",
    category: "3",
  },
  {
    type: "short",
    message: "각 군집의 중심점 사이의 거리로서 계산하는 방법",
    correct: "중심연결법",
    category: "3",
  },
  {
    type: "short",
    message:
      "군집 내 오차(편차제곱합)가 최소가 되는 데이터로 거리를 계산하는 방법",
    correct: "와드연결법",
    category: "3",
  },
  {
    type: "short",
    message:
      "군집의 수를 사전에 정한 뒤 집단 내 동질성과 집단 간 이질성이 모두 높게 전체 데이터를 분할하는 알고리즘",
    correct: "k-means 군집",
    category: "3",
  },
  {
    type: "pick",
    message: "k-means 군집은 최적___.",
    correct: "이 아닐 수도 있다",
    wrongs: ["이다"],
    category: "3",
  },
  {
    type: "short",
    message:
      "혼합 분포 군집: ___ 알고리즘은 확률모델의 최대가능도를 갖는 모수와 함께 그 확률모델의 가중치를 추정하고자 한다.",
    correct: "EM",
    category: "3",
  },
  {
    type: "short",
    message:
      "인공신경망 기반 차원축소와 군집화를 동시에 수행할 수 있는 알고리즘이다. 코호넨 맵이라고도 한다.",
    correct: "자기조직화지도",
    category: "3",
  },
  {
    type: "short",
    message:
      "연관분석에서, 전체 거래 중에서 A, B 라는 두 개의 품목이 동시에 포함된 거래의 비율",
    correct: "지지도",
    category: "3",
  },
  {
    type: "short",
    message: "연관분석에서, 조건부확률로 나타낼 수 있는 것",
    correct: "신뢰도",
    category: "3",
  },
  {
    type: "short",
    message: "연관분석에서, 상관관계를 나타낼 수 있는 것",
    correct: "향상도",
    category: "3",
  },
  {
    type: "short",
    message:
      "랜덤 모델과 비교하여 해당 모델의 성과가 얼마나 향상되었는지 구간별로 파악하기 위한 그래프는?",
    correct: "향상도 곡선",
    category: "3",
  },
  {
    type: "short",
    message:
      "가능한 모든 경우의 수를 탐색하여 측정지표가 높게 나타나는 연관규칙을 찾는 방식은 ___ 알고리즘이다.",
    correct: "apriori",
    category: "3",
  },
  {
    type: "short",
    message:
      "연관분석의 알고리즘에서 ___ 알고리즘이란, 지지도가 낮은 품목부터 차츰 올라가면서 빈도수가 높은 아이템 집합을 생성하는 상향식 알고리즘이다. 상대적으로 속도가 빠르며 연산 비용이 저렴하다.",
    correct: "FP-Growth",
    category: "3",
  },
  {
    type: "short",
    message: "연관분석은 품목 ___ 에 어려움이 있다.",
    correct: "세분화",
    category: "3",
  },
  {
    type: "short_order",
    message: "암묵지 → ( ___ ) → ___ → ( ___ ) → ___ → ( ___ ) → 암묵지",
    correct: ["형식화", "형식지", "체계화", "방법론", "내재화"],
    category: "3",
  },
  {
    type: "short_order",
    message:
      "데이터 거버넌스의 체계 순서: 데이터 ___, 데이터 ___, 데이터 ___, ___",
    correct: ["표준화", "관리 체계", "저장소 관리", "표준화 활동"],
  },
  {
    type: "short_order",
    message:
      "대부분의 군집분석 알고리즘은 개체간의 거리를 이용하는 데 반해, ___ 알고리즘은 개체들이 밀집한 정도에 기초해 군집을 형성한다. ___을 설정할 필요가 없다.",
    correct: ["DBSCAN", "초기 군집의 수"],
    category: "3",
  },
  {
    type: "short_order",
    message:
      "의사결정나무의 단점: ___ 사이의 중요도를 판단하기 쉽지 않고, ___ 근처의 자료에 대해 오차가 크며, ___ 발생 가능성이 높다.",
    correct: ["독립변수", "분류 경계선", "과적합"],
    category: "3",
  },
  {
    type: "short",
    message: "범주형 자료 간의 관계를 알아보고자 할 떄 사용되는 분석 방법이다.",
    correct: "교차분석",
    category: "3",
  },
  {
    type: "short",
    message: "데이터의 형식을 유지한 채 식별할 수 없는 임의의 값으로 대체",
    correct: "데이터 마스킹",
    category: "1",
  },
  {
    type: "short",
    message: "데이터의 값을 다른 값으로 변경하는 것은? ___ 처리",
    correct: "가명",
    category: "1",
  },
  {
    type: "short",
    message:
      "각각의 데이터가 아닌 전체 데이터에 대한 총합 또는 평균으로 데이터를 보여주는 것은? ___ 처리.",
    correct: "총계",
    category: "1",
  },
  {
    type: "short",
    message: "데이터를 특정 값이 아닌 범위를 보여주는 것: 데이터 ___.",
    correct: "범주화",
    category: "1",
  },
  {
    type: "short_order",
    message: "분석 성숙도 평가 4단계 차례대로",
    correct: ["도입", "활용", "확산", "최적화"],
    category: "2",
  },
  {
    type: "short_multi",
    message: "데이터 거버넌스 구성요소 크게 세 가지",
    correct: ["원칙", "조직", "프로세스"],
    category: "2",
  },
  {
    type: "short",
    message: "데이터 분할의 목적은 ___을 방지하는 것이다.",
    correct: "과적합",
    category: "3",
  },
  {
    type: "short",
    message: "계층적 군집분석 R 함수 이름은?",
    correct: "hclust",
    category: "3",
  },
  {
    type: "short",
    message: "k-평균 군집 분석 R 함수 이름은?",
    correct: "kmeans",
    category: "3",
  },
  {
    type: "short",
    message: "주성분분석 R 함수 이름은?",
    correct: "princomp",
    category: "3",
  },
  {
    type: "short",
    message: "인공신경망 R 함수 이름은?",
    correct: "neuralnet",
    category: "3",
  },
  {
    type: "short",
    message: "의사결정나무 R 함수 이름은?",
    correct: "ctree",
    category: "3",
  },
  {
    type: "short",
    message:
      "종속변수가 이산형인 의사결정나무에서 분류 기준이 카이제곱 통계량인 알고리즘은?",
    correct: "CHAID",
    category: "3",
  },
  {
    type: "short",
    message:
      "종속변수가 이산형인 의사결정나무에서 분류 기준이 지니지수인 알고리즘은?",
    correct: "CART",
    category: "3",
  },
  {
    type: "short",
    message:
      "종속변수가 이산형인 의사결정나무에서 분류 기준이 엔트로피 지수인 알고리즘은?",
    correct: "C4.5",
    category: "3",
  },
  {
    type: "short",
    message:
      "종속변수가 연속형인 의사결정나무에서 분류 기준이 F 통계량인 알고리즘은?",
    correct: "CHAID",
    category: "3",
  },
  {
    type: "short",
    message:
      "종속변수가 연속형인 의사결정나무에서 분류 기준이 분산감소량인 알고리즘은?",
    correct: "CART",
    category: "3",
  },
  {
    type: "short",
    message:
      "K-평균 군집을 수행할 때 초깃값 SEED의 개수 K를 결정하기 위한 그래프는? ___ 그래프.",
    correct: "제곱합",
    category: "3",
  },
  {
    type: "short",
    message:
      "혼합 분포 군집에서 분포(군집)의 수를 결정할 떄 최대 ___ 값을 갖는 분포의 수를 선택할 수 있다.",
    correct: "BIC",
    category: "3",
  },
  {
    type: "short",
    message:
      "___ 모델: 분석 프로젝트의 방법론 중 하나로, 모든 단계가 순차적으로 진행되는 가장 단순한 모델이다. 이전 단계가 완료된 이후 다음 단계로 진행가능한 하향식(Top-Down) 구조를 띤다. 필요한 경우 이전 단계로 돌아가 피드백 과정을 수행할 수 있다.",
    correct: "폭포수",
    category: "1",
  },
  {
    type: "short_multi",
    message: '시계열의 구성요소 네 가지는? ("요인"이라는 단어 제외)',
    correct: ["추세", "순환", "계절", "불규칙"],
  },
  {
    type: "short_multi",
    message: "데이터가 범주형일 때의 거리 측도는 ___ 거리, ___ 거리 등이 있다.",
    correct: ["자카드", "코사인"],
  },
  {
    type: "short",
    message: "모델의 성능을 판단하기 위해 작성한 표의 이름은?",
    correct: "이익도표",
  },
  {
    type: "short",
    message: "자바 기반 대용량 데이터 분산 처리 프레임워크는?",
    correct: "하둡",
  },
  {
    type: "short",
    message:
      "다양한 전문 지식을 종합한 학문으로 여러 데이터로부터 의미있는 정보를 추출하고 나아가서 그 결과를 효과적으로 전달하는 것을 포함하는 것은?",
    correct: "정보전략계획",
  },
  {
    type: "short",
    message: "시간 개념이 추가된 연관분석",
    correct: "순차패턴",
  },
  {
    type: "short",
    message:
      "순환 신경망. 언어 모델링, 음성 인식 등에 활용됨. 오래된 데이터에 대한 문맥 처리가 어렵다. ",
    correct: "RNN",
  },
  {
    type: "short",
    message: "합성곱 신경망. 이미지 분류 등. ",
    correct: "CNN",
  },
];
