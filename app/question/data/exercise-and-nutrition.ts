import type { QuestionContent } from "../types";

/**
 *
 * 추가할 키워드
 * 건강에 영향을 적게 미치는 것, 많이 미치는 것
 * 비만인 운동효과. 지방합성 억제, 스트레스 감소, 인슐린 감수성, 기초대사량 감소
 * 과부화의 원리
 * 주 에너지원. 포도당. 경기종목.
 * 심폐지구력. 트레이닝 방법.
 * 평활근 내장근 민무늬-무늬 운동신경 - 신경지배, 항피로, 약함
 * P파 심방 심실 재분극 탈분극
 * 혈압 고강도면 최대, 저항, 수축기, 이완기, 심박출량
 * 고혈압 개선. 체수분, 심박출량, 혈관의 탄성, 말초혈관저항, 카테콜라민, 혈관의 밀도, 굵기
 * 호흡지수, VCO2, 탄수화물, 칼로리, 지방, 0.7, 1.0
 * 고온에서 체온 조절 - 교감신경, 체성신경, 부교감신경, ADH 분비, 땀분비, 운동 억제, 소화흡수 증가, 수분 재흡수 촉진
 * 고온 순응, 심부온도, 심박수, 땀분비, 직장온도
 * 저온환경, 혈중젖산, 글리코겐, 말초혈관, 1회 박출량
 * 체력검사, 객관성. 재현성, 측정 결과 동일, 기준치,
 * 운동부하검사, 운동중지, 발한, 안면 창백, 확장기 혈압 10mmHg, 점증운동부하
 * 대사당량(MET), 정의
 * 안정시대사량 정의
 * 체력요소, 건강관련, 운동기능 관련 종류 - 유연성, 순발력, 민첩성, 스피드
 * 체중감소, 식이요법, 운동요법
 * 고혈압, 유발요인, 교감신경계 향진, 흡연, 비만, 음주, 과도한 염분 섭취
 * 고혈압 환자, 베타차단제, 저항운동, 나트륨, 운동시행 금지 기준
 * 고밀도지단백(HDL) 정의
 * 혈액지질검사 결과 - 콜레스테롤, 중성지방, LDL, HDL
 * 동맥경화증, 관상동맥 질환
 * 제1형 당뇨병, 운동시 혈증 포도당 농도가 유지될 수 있는 혈장 인슐린의 농도는?
 * 말초신경장애 권장되지 않는 운동. 어떤 병에 권장/권장되지 않는 운동
 * 대사증후군. 허리둘레, 중성지방, 콜레스테롤, HDL콜레스테롤, 남, 혈압 수축기, 이완기 혈압, 공복혈당
 * 운동선수에게 좀 더 권장.
 * 비타민 A, 비타민 C, 비타민 $K_3$, 비타민 D
 * 비타민 B_6, 무기질, 뼈건강, 비타민, 태양광, 필로퀴논, 코발아민, 피리독사민, 콜레칼시페롤
 * 메다니온, 항각기인자, TPP, 조효소,
 * 발한작용, 과수화 효과, 카페인, 글리세롤, L-카르니틴, 동화작용 스테로이드
 * 수분중독, 열피로, 고염식, 총체액량
 * 수분 섭취.
 *
 *
 */

export const questions: Partial<QuestionContent>[] = [
  // {
  //   type: "short_order",
  //   message:
  //     "___ : 골격의 운동. 자세 유지. 수축시 열 생성. 근 필라멘트 있음. ___ 신경의 지배를 받는다. 운동성은 ___ 이다.",
  //   corrects: ["골격근", "운동", "수의적"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message:
  //     "근육의 종류 중 ___ 만 무산소성 에너지원과 유산소성 에너지원을 모두 사용한다.",
  //   corrects: ["골격근"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: "___ : 혈액 펌프를 위한 심장 운동. ___ 신경의 지배를 받는다.",
  //   corrects: ["심근", "자율"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: "___ : 내장 기관과 혈관의 운동. ___ 신경의 지배를 받는다.",
  //   corrects: ["평활근", "자율"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: "근 ___ 는 심근에는 있고 평활근에는 불규칙적으로 있다.",
  //   corrects: ["필라멘트"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ` [
  //     "근수축 속도가 빠른 순서로 나열된 것은?",
  //     "1: 골격근",
  //     "2: 심근",
  //     "3: 평활근",
  //   ]`,
  //   corrects: ["1", "2", "3"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: `[
  //     "신경전도 속도가 빠른 순서로 나열된 것은?",
  //     "1: 골격근",
  //     "2: 심근",
  //     "3: 평활근",
  //   ]`,
  //   corrects: ["1", "2", "3"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "골격근은 관절을 사이에 두고 수축하는 근육으로 인체의 직접적인 운동을 만들어 내는 근육이다. 운동을 수행할 때 골격근은 수축하기 위하여 ___ 라는 에너지를 사용한다.",
  //   ],
  //   corrects: ["ATP"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "근 수축 시 ___ 및 ___ 의 각 필라멘트끼리 서로 미끄러져 안으로 들어가면서 근수축이 발생하게 되는데 이를 ___ 설이라 한다.",
  //   ],
  //   corrects: ["액틴", "미오신", "근수축활주"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "근섬유 타입 : 천천히 수축하되 지속적으로 수축할 수 있는 ___ 섬유와, 빨리 수축하되 오래 지속할 수 없는 ___ 섬유로 나뉜다.",
  //   ],
  //   corrects: ["지근", "속근"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "지근은 속근보다 혈관분포가 ___ (많다/짧다)",
  //     "그리고 지근은 색깔이 ___ (빨간/흰)색 이다.",
  //   ],
  //   corrects: ["많다", "빨간"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["___ : 근력이 저하하여 기대되는 힘을 계속 발휘할 수 없는 상태"],
  //   corrects: ["근피로"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "ATP&PC 가 고갈되는 운동은 ___ 시간 ___ 강도 운동.",
  //     "혈중 글루코스 및 근 글리코겐이 고갈되는 운동은 ___ 시간 ___ 강도 운동.",
  //   ],
  //   corrects: ["단", "고", "장", "저"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 은 직접적인 인체의 대사 산증을 만드는 것이 아니다. 부산물이 아니라, 대사 중간체로 보는 게 맞다! 반면, 무산소 대사가 활성화될 때 ___ 가 방출되는 것이고 그것이 대사 산증을 유발한다.",
  //   ],
  //   corrects: ["젖산", "수소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "호흡에 의해 획득한 산소와 음식으로부터 얻은 영양소는 ___ 을 통해 전신으로 이동된다.",
  //   ],
  //   corrects: ["혈액"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "____ 는 혈액을 전신에 지속적으로 공급하고 각 조직에서 생성된 노폐물을 처리하는 장소로 운반하여 생체를 일정하게 유지한다.",
  //   ],
  //   corrects: ["심혈관계"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "혈액의 순서: 대정맥 - ___ - ___ - ___ - 폐 - 폐정맥 - ___ - ___ - ___ - 대동맥",
  //   ],
  //   corrects: ["우심방", "삼첨판막", "우심실", "좌심방", "승모판", "좌심실"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "심박수 :  ___ > ___ > ___",
  //     "1: 성인 & 여성",
  //     "2: 남성",
  //     "3: 어린이나 청소년",
  //   ],
  //   corrects: ["3", "1", "2"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["운동 중 심박수는 ___ 와 비례."],
  //   corrects: ["운동강도"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "pick",
  //   message: ["장거리 육상 선수는 평상시에서 일반 사람들보다 심박수가 더 ___ "],
  //   correct: "낮다",
  //   options: ["높다"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "pick",
  //   message: [
  //     "운동 전후의 체중변화가 적을 수록 수화상테가 ___ 하게 운동했다는 것을 의미.",
  //   ],
  //   correct: "양호",
  //   options: ["불량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 심장 근육은 스스로 전기 신호를 발생시키는 독특한 능력을 가지고 있어서 신경 자극 없이도 주기적으로 수축한다. 이러한 전기적 신호를 파형으로 기록한 것.",
  //   ],
  //   corrects: ["심전도"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["P파: ___ 의 ___.", "QRS군: ___ 의 ___.", "T파: ___ 의 ___."],
  //   corrects: ["심방", "탈분극", "심실", "탈분극", "심실", "재분극"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["___ : 혈액이 혈관벽에 미치는 압력. 일반적으로 ___ 을 의미."],
  //   corrects: ["혈압", "동맥혈압"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["수축기 혈압 : ___ 의 수축 시 발현되는 압력"],
  //   corrects: ["심실"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["이완기 혈압 : 최소혈압 심실의 이완시 ___ 에서의 혈압"],
  //   corrects: ["동맥"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "고령자는 혈관의 ___ 이 낮기 때문에 고강도 운동 시 혈압이 위험할 정도로 증가할 수가 있다.",
  //   ],
  //   corrects: ["탄력성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "pick",
  //   message: ["혈압이 증가하는 이유는?"],
  //   options: ["지구력 전신운동"],
  //   correct: "국소적인 저항성 운동",
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["혈압은 주로 ___ 의 증가로 기인한다."],
  //   corrects: ["심박출량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["혈압은 고강도 저항운동일 시 ___mmHg 이상을 넘을 수 있다."],
  //   corrects: ["200"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "지속적 운동은 고혈압 증상을 개선시킨다. 그 이유:  ___, ___ 감소시키고 혈관의 ___, ___, ___ 증가시키기 때문.",
  //   ],
  //   corrects: ["심박출량", "말초혈관저항", "밀도", "굵기", "탄력성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 심장 : 심방 부피와 심실벽 근육층의 증가에 의하여 심장이 전체적으로 커지는 현상",
  //   ],
  //   corrects: ["스포츠"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "기관과 폐 등의 ___ 는 운동수행에 필요한 에너지를 생산하기 위하여 산소를 대기 중으로부터 획득하고 내부에서 생성된 이산화탄소를 밖으로 배출하는 역할을 한다. ",
  //   ],
  //   corrects: ["호흡계"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "호흡계의 역할 : 가스 교환을 위한 ___ 제공, 조직들을 통하여 가스 교환을 위한 공기의 ___ 제공, 공기와 접촉하는 부분의 건조 및 온도 변화 등 환경변화로부터의 ___ . ",
  //   ],
  //   corrects: ["면적", "이동경로", "보호"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동하기 전에는 호흡조절 ___ 에 의해 일정하게 조절.",
  //     "실제로 운동하지 않더라도 ___ 할 때, 대뇌피질의 수의적 자극만으로도 환기량이 증가.",
  //     "운동 시작 후 처음 몇 초 동안은 중추 명령에 의해 환기량이 빠르게 증가.",
  //     "운동 완료 직후는 빠르게 감소.",
  //     "이후 완만하게 감소. ",
  //   ],
  //   corrects: ["신경", "긴장"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["소비된 산소 1L는 약 ___ kcal 의 에너지 소비를 반영."],
  //   corrects: ["5"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ = 이산화탄소 생성량(VCO_2) / 산소 소비량(VO_2).",
  //     "이론적으로 순수한 탄수화물이 분해될 때는 ___",
  //     "지질이 분해될 때에는 ___",
  //     "값이 높을 수록 칼로리가 미세하게 ___(높음/낮음)",
  //   ],
  //   corrects: ["호흡지수", "1.0", "0.7", "높음"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "인체는 운동수행을 위한 근수축 시 많은 양의 열에너지가 생성되지만 생체 내의 엄격한 체온조절 작용에 의하여 ___ 을 증가시키켜 약 ___ ℃의 정상 체온을 항상 유지하게 된다.",
  //   ],
  //   corrects: ["발한", "37"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체온이 상승하면 자율신경이 ___ 을 자극하여 땀이 분비된다.",
  //     "___ 을 통해 운동을 억제한다. ",
  //     "___ (항이뇨호르몬) 분비가 촉진되어 수분 재흡수를 촉진한다.",
  //   ],
  //   corrects: ["교감신경", "체성신경", "ADH"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "**저온에서의 운동시 체온조절 기전**",
  //     "자율신경이 ___ 을 자극하여 땀 분비가 억제된다.",
  //     "___ 을 통해 몸이 떨린다.",
  //     "___ 분비가 촉진되어 체열생산을 촉진한다.",
  //     "___ 분비가 촉진되어 신진대사가 촉진된다.",
  //   ],
  //   corrects: ["부교감신경", "체성신경", "코르티솔", "티록신"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "고온 순응 : 생리적 운동수행능력과 내성이 향상되는 것.",
  //     "적응기에는 땀 ___ 한다. 심박수는 ___ 한다. 체온은 ___ 한다.",
  //   ],
  //   corrects: ["증가", "감소", "감소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "**저온에서의 운동 시 반응**",
  //     "산소 소비량이 증가한다. 그래서 운동 수행력이 ___ 한다.",
  //     "혈중 젖산 농도는 ___ 한다.",
  //     "근육 내 글리코겐 저장량이 ___ 하므로, 근피로에 대한 내성도 ___ 한다.",
  //     "열 보존을 위해 혈관이 ___ 하고 말초로의 혈액 공급이 크게 ___.",
  //   ],
  //   corrects: ["감소", "감소", "증가", "증가", "수축", "감소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "저온순응: 떨림 현상이 줄어든다. 1시간 미만의 강한 추위나 8시간 이상 중정도 추위가 ___ 동안 노출되거나, 낮은 정도의 추위가 ___ 동안 노출될 때.",
  //   ],
  //   corrects: ["1주", "2주"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 체력향상 및 건강 증진, 질병 예방을 위하여 개개인에게 적합한 운동의 종류와 양을 선택하여 개별적으로 운동을 설계하고 관리하는 것",
  //   ],
  //   corrects: ["운동처방"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동처방의 목적 : ___ 향상, ___ 강화. 청소년기는 ___ 를 돕는다. 중/장년기는 ___ 을 유지시킨다.",
  //   ],
  //   corrects: ["운동기술", "체력", "성장", "건강"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "사전 건강검사 : 일반적으로 문진이나 개인기록카드를 통해 ___ 이나 ___ 을(를) 평가하고 혈액 검사 및 소변검사 등을 시행한다.",
  //   ],
  //   corrects: ["병력", "생활습관"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 운동 중 일어날 수 있는 사고를 방지하기 위해 미리 진단하는 것. 심전도 검사 등 다양하게 한다. ",
  //   ],
  //   corrects: ["운동부하검사"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_multi",
  //   message: [
  //     "체력(운동능력) 검사시 테스트 실시 대상인 체력의 기본 요소 다섯가지.",
  //   ],
  //   corrects: ["근력", "순발력", "민첩성", "지구력", "유연성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체력 검사 주의점 - ___ : 테스트 목적에 맞는 종목으로, 테스트 내용이 명확해야 함.",
  //   ],
  //   corrects: ["타당성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["체력 검사 주의점 - ___ : 측정치의 재현성이 높은 종목이어야 함."],
  //   corrects: ["신뢰성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체력 검사 주의점 - ___ : 측정자가 바뀌거나, 다른 장소에서 측정해도 같은 결과가 나와야 함.",
  //   ],
  //   corrects: ["객관성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체력 검사 주의점 - ___ : 평가에 의한 기준치를 얻을 수 있는 종목이어야 함.",
  //   ],
  //   corrects: ["표준성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "**운동부하 검사시 운동 중지를 위한 지침**",
  //     "빈번한 ___ (PVCs) 출현",
  //     "___ 의 증대",
  //     "___ mm 또는 그 이상의 ST 부분의 강하",
  //     "심박수의 극단적인 상승",
  //     "점증운동부하에 따라 심박수 또는 혈압이 보통 증가하지만 증가하지 않는 경우, 또는 운동부하증가와 함께 ___ 혈압이 오히려 저하하는 경우",
  //     "이완기 혈압이 ___ mmHg 또는 그 이상의 상승이나 ___ mmHg이상으로 상승한 경우",
  //   ],
  //   corrects: ["조기심실수축", "협심통", "2.0", "수축기", "20", "110"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_multi",
  //   message: [
  //     "운동 처방의 작성 시 운동의 가부와 강도에 관한 안전 한계치 및 유효 한계치를 결정한 후, 개인에게 알맞은 ___, ___, ___, ___ 등을 포함한 운동처방 프로그램을 작성.",
  //   ],
  //   corrects: ["강도", "시간", "빈도", "종목"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 운동 : 주 2~3회 추천. 적절한 휴식이 필요하므로 적어도 하루 정도의 휴식을 취해야 함.",
  //   ],
  //   corrects: ["저항성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 운동 : 주 3회 이상 추천. 단, 운동량이 많을 때 매일 격렬하게 할 경우 근골격계가 충분히 휴식할 시간이 없어져서 상해가 발생하기 쉬움.",
  //   ],
  //   corrects: ["유산소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동강도 지표 - ___ : 단위체중의 분당 산소소비량을 나타낸 값. %VO_2max",
  //   ],
  //   corrects: ["최대산소섭취량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동강도 지표 - ___ : 최대 운동 시 심박수를 측정한 것. 상대운동강도를 결정할 때 사용.",
  //   ],
  //   corrects: ["최대심박수"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동강도 지표 - ___ (___) : 운동할 때 스스로 느끼는 정도를 숫자로 표기한 척도. 보그 교수가 개발하여 보그 척도라고도 함.",
  //   ],
  //   corrects: ["지각인지도", "RPE"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동강도 지표 - ___ (___) : 산소소비량을 기준으로 일상생활에서 쉽게 운동강도를 결정할 수 있는 방법. 신체활동을 하지 않는 안정 시 산소소비량(3.5Ml/kg/min)을 1으로 하여 각 신체활동의 상대강도를 결정할 때 이용.",
  //   ],
  //   corrects: ["대사당량", "MET"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["유산소 운동의 경우 운동 시간이 ___ 분 이상이어야 효과가 있음."],
  //   corrects: ["10"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_multi",
  //   message: ["건강관련 체력요소 5가지"],
  //   corrects: ["신체조성", "심폐지구력", "근력", "근지구력", "유연성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_multi",
  //   message: ["운동기능 관련 체력요소 5가지"],
  //   corrects: ["평형성", "순발력", "민첩성", "협응력", "반응시간"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["운동능력, 체력 검사 순서: ___ -> ___ -> ___ 및 전신 ___"],
  //   corrects: ["체지방", "유연성", "근력", "지구력"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 측정: 신체조성을 필드에서 측정하는 방법. 복부. 인체의 지방량을 대변할 수 있는 부위를 측정하여 전체 지방량 또는 비율 측정.",
  //   ],
  //   corrects: ["피지후"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_multi",
  //   message: ["지용성 비타민 종류"],
  //   corrects: ["A", "D", "E", "K"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["지용성 비타민은 과량 섭취시 ___ 을 유발한다."],
  //   corrects: ["독성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["수용성 비타민: 비타민 ___ 군, 비타민 ___"],
  //   corrects: ["B", "C"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "수용성 비타민은 과량 섭취시 ___ 으로 배설되나, 장기간 과량의 보충제 섭취는 바람직하지 않음.",
  //   ],
  //   corrects: ["소변"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["비타민 A - ___ : 활성이 가장 높고 자유라디칼 소거 항산화 가능."],
  //   corrects: ["베타카로틴"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 A - 결핍시 ___, ___ 증상 발생, 방어력 약화로 ___ 에 취약",
  //   ],
  //   corrects: ["야맹증", "안구건조증", "감염"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 A 보충제는 섭취할 필요가 없다. ___ 이(가) 손실되고 ___ 이(가) 손상된다. 과량의 섭취가 운동수행능력을 높인다는 근거 부족",
  //   ],
  //   corrects: ["뼈", "간"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 D : 다른 말로 ___.  ___ 과 ___ 의 항상성을 조절함. ___ 에 영향을 미침. ___ 을 통해 체내에서 합성 가능. ___ 의 경우 뼈가 건강해야 하므로, 비타민 D 영양상태를 유지하는 것이 필요.",
  //   ],
  //   corrects: ["콜레칼시페롤", "칼슘", "인", "세포", "자외선", "노인"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["비타민 E: ___ 작용. ___ 에 포함되어 있음."],
  //   corrects: ["항산화", "견과류"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동이 체내 산화스트레스에 미치는 영향: ___ 증가, ___ 산화, 비타민 ___ 소실",
  //   ],
  //   corrects: ["지질과산화", "단백질", "E"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "pick",
  //   message: [
  //     "비타민 E 는 실험마다 좀 다름. 지질과산화를 예방하는 효과를 본 것도 있고, 예방하지 못한 것도 있음. 오히려 지질과산화를 증가시킬 수도 있음. 유익하다는 증거는 ___",
  //   ],
  //   correct: "없음",
  //   options: ["있음"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["비타민 K: 다른 말로 ___.  ___ 에 중요함."],
  //   corrects: ["필로퀴논", "혈액응고"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 B1: 다른 말로 ___. 조효소 ___ 의 구성성분. 부족시 ___ 생성 저하. ___ 발생할 수 있음.",
  //   ],
  //   corrects: ["티아민", "TPP", "ATP", "각기병"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["조직의 콜레스테롤을 간으로 운반하여 체외로 배출되게 하는 것은?"],
  //   corrects: ["고밀도지단백"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 B1 (티아민): ___ 에 있어 신경계 기능을 향상시킴. 과학적 근거 별로 없음. 에너지 ___ 이 많을 수록 티아민 많이 먹어야 함.",
  //   ],
  //   corrects: ["조준사격", "소모량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 B2 : 다른 말로 ___ . ___, ___ 형태의 조효소로 전자전달계에서 에너지 생성에 관여. 과량 섭취할 필요가 없음.",
  //   ],
  //   corrects: ["리보플라빈", "FAD", "FMN"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 B3 또는 ___ : 니코틴산과 니코틴아마이드를 총칭하는 일반명. 조효소인 ___ (근육 글리코겐에서), ___ (지방에서)의 형태로 환원효소를 보조하는 역할. 결핍되면 ___ 가 발생할 수 있음. ___ 이 필요한 운동은 오히려 보충이 권장되지 않는다.",
  //   ],
  //   corrects: ["니아신", "NAD", "NADP", "펠라그라", "지구력"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "엽산 : 조효소 형태는 ___ . ___ 전이반응의 조효소로 작용. DNA 및 RNA 합성, ___ 생성에 작용한다. 엽산 보충이 운동수행능력을 향상시킨다는 과학적 근거 부족. 결핍시 빈혈.",
  //   ],
  //   corrects: ["THF", "단일탄소", "헤모글로빈"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 B12: 코발트를 함유한 ___ 화합물. 장내 세균에 의해서 일부 합성. ___ 형성에 중요한 역할. ___ 합성에도 필수적. 과량의 보충제가 운동수행능력을 높인다는 근거는 없음. ___, ___ 의 경우 섭취하면 좋음. 결핍 시 빈혈",
  //   ],
  //   corrects: ["코발라민", "적혈구", "DNA", "노인", "채식주의자"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "비타민 C: 수용성 ___ 비타민. 아스코르빈산. ___ 발생 가능. 장기간 고강도 운동은 산화스트레스를 높이기 때문에 운동선수들이 운동보조제로 많이 사용함. 운동선수들은 권장량보다 조금 높은 수준인 ___ mg 정도 섭취할 것을 권장.",
  //   ],
  //   corrects: ["항산화", "괴혈병", "200"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_multi",
  //   message: ["결핍 시 거대 적아구성 빈혈을 일으킬 수 있는 것 두 개"],
  //   corrects: ["비타민 B12", "엽산"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["___ 은 거의 모든 식품에 들어있어 결핍증이 없다."],
  //   corrects: ["인"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["고강도 운동으로 땀을 심하게 흘리는 경우 ___ 요구량이 증가한다."],
  //   corrects: ["마그네슘"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동은 항이뇨호르몬과 알도스테론의 분비를 촉진하여 ___과 ___ 을 보유할 수 있도록 한다.",
  //   ],
  //   corrects: ["체수분", "나트륨"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 섭취량이 충분하지 않은 상태에서 운동량이 증가하면 이것의 영양상태가 불량해질 수 있다.",
  //   ],
  //   corrects: ["칼슘"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체내 산소 운반에 필수적인 미량 무기질로서 채식주의 여자 운동선수에게 결핍되기 쉬운 영양소는?",
  //   ],
  //   corrects: ["철"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "세포 외액에 가장 높은 농도로 존재하는 양이온은 ___ 이온 이다.",
  //     "세포 외액에 가장 높은 농도로 존재하는 음이온은 ___ 이온 이다.",
  //     "세포 내액의 가장 높은 농도로 존재하는 양이온은 ___ 이온 이다.",
  //     "세포 내액의 가장 높은 농도로 존재하는 음이온은 ___ 이온 이다.",
  //   ],
  //   corrects: ["나트륨", "염화", "칼륨", "인산수소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "이용율이 낮고 섭취량도 부족하기 때문에 비교적 영양불량인 경우가 많음.",
  //   ],
  //   corrects: ["철"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["면역기능과 관련이 있는 미량무기질은?"],
  //   corrects: ["아연"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 항산화작용을 하는 미량무기질. 과다 섭취하면 중독 증상을 일으키니 주의해야 한다.",
  //   ],
  //   corrects: ["셀레늄"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["비타민 E를 다른 말로 하면?"],
  //   corrects: ["알파토코페롤"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["비타민 C를 다른 말로 하면?"],
  //   corrects: ["아스코르브산"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "철인 3종 경기와 같은 장시간 지속되는 초지구력 고강도 운동은 수분 + ___ 보충을 통해 ___ 을 보충한다.",
  //   ],
  //   corrects: ["전해질", "나트륨"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["고강도 운동 시 마그네슘을 보충하면 ___ 을 완화시킨다."],
  //   corrects: ["근육경련"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "식이제한과 구토는 ___ 결핍을 초래할 수 있고, 운동수행능력을 감소시킬 수 있다.",
  //   ],
  //   corrects: ["칼륨"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 척추동물의 적혈구 속에 들어 있는 철을 함유한 색소단백질로서 산소와 이산화탄소의 운반에 관여. 이것의 혈중 농도는 산소운반능력과 비례함.",
  //   ],
  //   corrects: ["헤모글로빈"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 용액 내 이온으로 해리되어 양이온이나 음이온의 전류를 띠는 물질",
  //   ],
  //   corrects: ["전해질"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 전해질 섭취가 동반되지 않고 신장의 배설능력 이상의 과도한 수분을 섭취함으로써 총체액량이 증가하여 발생하는 수분 불균형 상태. ___ 와 유사한 증상이나 징후가 나타난다.",
  //   ],
  //   corrects: ["수분중독", "열피로"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체수분의 생리적 기능 : 화학반응의 ___, ___ 운반, ___ 활동, ___ 조절",
  //   ],
  //   corrects: ["용매", "물질", "심혈관계", "체온"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["___ : 수분 섭취량이 배설량보다 적은 경우"],
  //   corrects: ["탈수"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "수분 균형 조절에 기여하지만, 수분 보충의 필요 정도를 알려주는 정확한 기준이 아닌 것은? ___ . 그리고 제일 중요한 것은? ___ .",
  //   ],
  //   corrects: ["갈증기전", "소변의색"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동시 탈수 정도가 심해지면 중심온도와 심박수가 ___ 하고, 1회 박출량이 ___ 함.",
  //   ],
  //   corrects: ["증가", "감소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "다량의 발한으로 인한 체수분 손실은 ___ 으로의 혈류량 감소를 일으켜 근피로 현상과 함께 운동을 ___ 에너지 대사과정에 더욱 의존하게 한다. 또한 피부혈류의 ___ 로 체온이 ___ 하며 내장혈류를 더욱 ___ 시켜 젖산 제거율을 ___ 시킨다.",
  //   ],
  //   corrects: ["근육", "무산소성", "감소", "증가", "감소", "감소"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동 전에는 적정량 수분을 섭취한다. 운동 중 수분 보충은 ___ 증상의 지연을 통해 운동수행능력에 긍정적인 효과를 준다. 수분 섭취가 중요할 경우 ___ 함량이 높지 않은 음료를 선택한다. 운동 후에도 수분을 충분히 섭취하도록 한다. 커피, 차, 맥주, 알코올 등은 ___ 작용이 있다.",
  //   ],
  //   corrects: ["탈수", "당질", "탈수"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "스포츠 음료 : ___ 이상 지속되는 운동에서 에너지 소모가 많을 때 적절.",
  //   ],
  //   corrects: ["1시간"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 운동시 피로의 발생을 지연시켜 운동수행능력을 향상시키는 것으로 알려져 있다. ___ 기반 운동 능력에 대한 효과가 있다. ___ 섭취에서 운동수행력 향상 효과가 두드러지게 나타난다.",
  //   ],
  //   corrects: ["카페인", "무산소", "소량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "운동 시 발한작용을 유지하거나 증가시면서도 수분 축적을 유지할 수 있도록 작용하는 과수화 효과가 있는 물질은?",
  //   ],
  //   corrects: ["글리세롤"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "이것의 에르고제닉 효과는 주로 30초 이내의 단기간 반복운동에서 두드러진 효과가 있으나 유산소 지구력개선효과는 나타나지 않으며, 골격근에 약 95%가 저장되어 있다. 이것은 무엇인가?",
  //   ],
  //   corrects: ["크레아틴"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 작용 ___ : 남성 호르몬인 테스토스테론과 유사하여 남성호르몬이 부족한 선수나 근육 증가를 통한 근력 향상을 목적으로 사용됨. 부작용 심함.",
  //   ],
  //   corrects: ["동화", "스테로이드"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 보충제: 운동 후 이것의 섭취는 근육 단백질량을 증가시키고 ___ 에도 효과적인 것으로 보고됨.",
  //   ],
  //   corrects: ["단백질", "근육통"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 소화력과 대사 효율성이 좋고 천연단백질 식품 가운데 곁가지 아미노산의 함량이 가장 높음.",
  //   ],
  //   corrects: ["유청단백질"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 보충제: 보디빌더나 역도선수처럼 근육을 발달시켜야 하는 경우 주로 이용되는 보충제. 자연 섭취가 바람직함.",
  //   ],
  //   corrects: ["아미노산"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 미토콘드리아 막을 통과할 수 없는 지방산을 내막으로 운송시켜 베타 산화를 가능하게 하는, 아미노산의 일종인 물질. 구강 섭취와 정맥 투여의 결과가 다르다. ",
  //   ],
  //   corrects: ["카르니틴"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "BMI의 비만 기준이 아시아인과 서양인에서 차이가 나타나는 이유는 무엇인가? 서양인이 아시아인보다 ___ 이 높기(많기) 때문.",
  //   ],
  //   corrects: ["근육량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["체지방율을 측정하는 데 한계가 있는 방법"],
  //   corrects: ["BMI"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "안정시대사량은 ___ 이 더 높다. 또한 안정시대사량은 ___, ___, ___과 양의 상관관계가 있으나 ___ 와는 음의 상관관계를 보인다.",
  //   ],
  //   corrects: ["남성", "신장", "체중", "제지방량", "나이"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "체지방조직 0.45kg 는 약 ___ kcal의 에너지를 발생시킨다. 심한 음의 열량 균형은 건강에 부정적인 영향을 미치므로 하루 최대 ___ kcal 전후의 음의 열량 균형만을 권장함. 즉 최대 주당 ___ kg 감량이 가능하고, 권장 감량은 ___ kg 이다.",
  //   ],
  //   corrects: ["3500", "1000", "0.9", "0.5"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["발열의 10% 는 ___ 발열, 15-30%는 ___ 발열, 60-75%는 ___ 이다."],
  //   corrects: ["식이성", "운동성", "기초대사량"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 이란 근육 수축시 이용되는 에너지로, 기초대사량과 함께 신체가 소비하는 에너지를 대변한다. 신체활동의 양과 ___ 에 비례한다.",
  //   ],
  //   corrects: ["활동대사량", "체중"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "스트레칭을 실시할 때 1회 ___ ~ ___ 초 권장, ___ ~ ___ 회 효과적.",
  //   ],
  //   corrects: ["15", "30", "2", "4"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "**수축기혈압**: 정상 - ___ 미만, 주의: ___ 미만, 고혈압 전 단계: ___ 미만, 고혈압1기: ___ 미만, 고혈압2기: 그 이상. 수축기 단독고혈압은 ___ 이상",
  //     "**이완기혈압**: 정상 - ___ 미만, 주의: ___ 미만, 고혈압 전 단계: ___ 미만, 고혈압1기: ___ 미만, 고혈압2기: 그 이상. 수축기 단독고혈압은 ___ 미만",
  //   ],
  //   corrects: [
  //     "120",
  //     "130",
  //     "140",
  //     "160",
  //     "140",
  //     "80",
  //     "80",
  //     "90",
  //     "100",
  //     "90",
  //   ],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "pick",
  //   message: ["올바른 걸 고르시오!"],
  //   correct: "아침에 운동하는 것, 저녁에 운동하는 것은 큰 차이가 없다.",
  //   options: [
  //     "아침에 운동하는 것이 저녁에 운동하는 것보다 효과가 좋다.",
  //     "저녁에 운동하는 것이 아침에 운동하는 것보다 효과가 좋다.",
  //   ],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["전체 고혈압의 대부분을 차지하는 것은? ___ 고혈압."],
  //   corrects: ["본태성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["혈압 = ___ * ___"],
  //   corrects: ["심박출량", "혈관저항"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "심박출량은 ___ 와 1회박출량 에 크게 영향 받고, 혈관저항은 혈관의 ___ 에 크게 영향받는다.",
  //   ],
  //   corrects: ["심박수", "지름"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "안정시 혈압이 수축기 ___ mmHg, 이완기 ___ mmHg 일 경우에는 운동을 시행하면 안 됨. ___ 를 복용중인 환자는 심박수의 증가유무에 주의해야 함.",
  //   ],
  //   corrects: ["200", "115", "베타차단제"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "고지혈증: 혈중 ___ 혹은 ___ 이 비정상적으로 증가하거나 ___ 이 지나치게 감소한 상태.",
  //   ],
  //   corrects: ["콜레스테롤", "중성지방", "고밀도지단백"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "한국인의 이상지질혈증 진단기준(mg/dL)",
  //     "총 콜레스테롤이 ___ 미만, 중성지방이 ___ 미만, LDL 콜레스테롤이 ___ 미만, HDL 콜레스테롤이 ___ 이상이면 적정이다.",
  //     "총 콜레스테롤이 ___ 이상, 중성지방이 ___ 이상, LDL 콜레스테롤이 ___ 이상, HDL 콜레스테롤이 ___ 미만이면, 안좋은 건 높고 좋은 건 낮은 상태이다.",
  //   ],
  //   corrects: ["200", "150", "100", "60", "240", "200", "160", "40"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "고지혈증에 의한 만성합병증인 ___ 이 진행되면, ___ 과 ___ 등을 유발.",
  //   ],
  //   corrects: ["동맥경화", "협심증", "심근경색"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["음주로 인한 고혈압 유발 요인은 ___ 기능 저하이다."],
  //   corrects: ["나트륨펌프"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "인슐린 ___ 형 당뇨병 (타입 I) : 췌장의 ___ 가 파괴되어 인체에 필요한 인슐린을 공급하지 못하여 발생함.",
  //   ],
  //   corrects: ["의존", "베타세포"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "인슐린 ___ 형 당뇨병 (타입 II) : 세포의 ___ 감수성이 감소하여 발생. 비만, 운동부족 등이 원인이 됨.",
  //   ],
  //   corrects: ["비의존", "인슐린"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "당뇨병 환자에서 운동요법의 단점: 중증도 혹은 장시간 운동 시 ___ 발생하고, 심한 강도의 운동 시 ___ 발생한다.",
  //   ],
  //   corrects: ["저혈당", "고혈당"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "당뇨병 환자가 혈당이 ___ ~ ___ mg/dl이라면, 운동으로 인한 인슐린의 민감성 증가로 저혈당이 발생할 수 있기 때문에, 탄수화물 섭취를 시킨 뒤 검사를 시행한다.",
  //   ],
  //   corrects: ["80", "100"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 한 개인에게 다양한 심혈관 질환과 제2형 당뇨병의 위험 요인들이 동시에 나타나는 현상을 한 가지 질환군으로 일컫는 말",
  //   ],
  //   corrects: ["대사증후군"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "대사증후군의 진단 기준: 아래 지표 중 3가지 이상이 기준치를 넘을 때.",
  //     "중심비만: 허리 둘레 남성 ___ cm (동양인 ___ cm), 여성 ___ cm (동양인 ___ cm)",
  //     "고중성지방 혈증: 중성지방 ___ mg/dL 이상",
  //     "낮은 HDL 콜레스테롤: 남성 ___ mg/dL 미만, 여성 ___ mg/dL 미만",
  //     "공복혈당: ___ mg/dL 이상 또는 혈당조절약 투약 중",
  //     "고혈압: 수축기 혈압 ___ mmHg 이상 또는 이완기 ___ mmHg 이상 또는 혈압조절약 투약 중",
  //   ],
  //   corrects: ["102", "90", "88", "80", "150", "40", "50", "100", "130", "85"],
  //   weight: 10,
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["비만은 ___ 에 의해서 체중이 늘어난 상태"],
  //   corrects: ["체지방"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ : 골질량의 감소와 골 미세구조의 다공성 증가로 골 취약성 및 골절 민감도가 증가하는 것. 고관절, 척추, 손목 등의 골절이 잘 일어나는 것이 특징.",
  //   ],
  //   corrects: ["골다공증"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 골다공증 : 원발성(1차)으로, 소주골 감소에 의한 척추압박골절이 특징.",
  //   ],
  //   corrects: ["폐경후"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "___ 골다공증 : 치밀골과 소주골의 감소. 대퇴골 경부 골절과 원위 골절. 주로 ___ 세 이상의 남녀가 해당.",
  //   ],
  //   corrects: ["노인성", "70"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["골다공증에서 잘 걸리는 성별은 ___(여성/남성) 이다."],
  //   corrects: ["여성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "골다공증 예방을 위헤 폐경기 여성은 운동 뿐만 아니라 ___ 요법도 병행할 것이 권장된다.",
  //   ],
  //   corrects: ["에스트로겐"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "**골다공증 환자를 위한 운동 프로그램에서 고려할 사항**",
  //     "일반적인 유산소운동 보다는 자세, 균형, 보행, 조정, 그리고 엉덩이와 몸통의 안정화에 초점을 맞춤.",
  //     "모든 형태의 운동 시 앞으로 ___되는 자세를 최소화해야 함.",
  //     "적어도 ___ ~ ___ 개월이 필요함.",
  //     "___ 근을 강화하기 위해 낮은 강도로 천천히 수행할 것을 권장함.",
  //     "넘어지는 걸 잘 방지해야 함.",
  //   ],
  //   corrects: ["굴곡", "9", "12", "요부신전"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["요통은 질환이 아닌 ___ 임. 수술 vs 비수술 치료 결과 비슷함. "],
  //   corrects: ["증상"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["요통은 ___ 강화 목적으로 하는 요통체조가 효과적이다."],
  //   corrects: ["근력"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["관절염: ___ 에서 증가하고, 성별로는 ___ 이 발병률이 더 높다."],
  //   corrects: ["노인", "여성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "건강에 영향을 미치는 요인 중 가장 큰 것부터 순서대로: ___, ___ 요인, ___, ___",
  //   ],
  //   corrects: ["생활습관", "생물학적", "환경", "보건의료"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "에너지 공급 속도가 느린 순서로 나열한 것은? ___ 시스템 - ___ 시스템 - ___ 시스템",
  //   ],
  //   corrects: ["유산소", "젖산", "ATP-PC"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "트레이닝의 원리 중 “개인의 능력, 잠재성, 각 스포츠 종목의 특수성을 고려하여 개별적으로 트레이닝을 실시해야 한다”라는 원리에 해당하는 것은?",
  //   ],
  //   corrects: ["개별성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "트레이닝의 원리 중 ___ 은 특정 운동 자극은 특정효과를 초래한다는 의미",
  //   ],
  //   corrects: ["특수성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "트레이닝의 원리 중 ___ 은 반복되는 훈련의 단조로움과 지루함을 극복하기 위해 다양한 프로그램을 제공해야 한다는 의미",
  //   ],
  //   corrects: ["다양성"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "트레이닝의 원리 중 ___ 은 일상생활 중에 받는 자극보다 더 강한 자극이 필요하다는 것을 의미",
  //   ],
  //   corrects: ["과부하"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "심폐지구력 및 근지구력 - ___ 트레이닝",
  //     "전신지구력 - ___ 트레이닝",
  //     "스피드능력 - ___ 트레이닝",
  //     "전반적인 체력 향상 - ___ 트레이닝",
  //     "근육 발달 - ___ 트레이닝",
  //   ],
  //   corrects: ["컨티뉴티", "인터벌", "리피티션", "서킷", "웨이트"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "**고혈압의 유발 요인**",
  //     "___ : 본태성 고혈압",
  //     "___ : 나트륨 펌프 기능 저하",
  //     "___ : 교감신경계 향진, 카테콜라민 유리, 심근 흥분성 촉진, 심박수 증가, 혈관 수축",
  //   ],
  //   corrects: ["유전", "음주", "흡연"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: ["동맥경화증 및 관상동맥 질환의 3대 주요인자는?"],
  //   corrects: ["흡연", "고혈압", "고콜레스테롤혈증"],
  //   tags: ["운동과영양"],
  // },
  // {
  //   type: "short_order",
  //   message: [
  //     "혈청지질 위험 수준",
  //     "총 콜레스테롤 ___ 이상",
  //     "중성지방 ___ 이상",
  //     "LDL ___ 이상",
  //     "HDL ___ 이하",
  //   ],
  //   corrects: ["240", "250", "160", "35"],
  //   weight: 10,
  //   tags: ["운동과영양"],
  // },
];
