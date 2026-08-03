type Lang = "zh-CN" | "zh-TW" | "en" | "ja" | "ko";

function detectLang(locale?: string): Lang {
  switch (locale) {
    case "en":
    case "en-US":
    case "English":
      return "en";
    case "ja":
    case "ja-JP":
    case "日本語":
      return "ja";
    case "ko":
    case "ko-KR":
    case "한국어":
      return "ko";
    case "zh-TW":
    case "繁體中文":
      return "zh-TW";
    case "zh-CN":
    case "zh":
    case "中文":
    default:
      return "zh-CN";
  }
}

interface PromptStrings {
  suffix: string;
  roleEditor: string;
  roleWorldbuilder: string;
  roleCharacterDesigner: string;
  roleOutlinePlanner: string;
  roleNovelist: string;
  roleSummaryEditor: string;
  metadataFields: string;
  worldviewFields: string;
  characterFields: string;
  outlineFields: string;
  antiHallucination: string;
  consistencyRules: string;
  writingRules: string;
  conceptLabel: string;
  metadataLabels: { title: string; category: string; tags: string; summary: string };
  worldviewLabel: string;
  characterLabels: { name: string; gender: string; age: string; personality: string; background: string; goal: string; appearance: string };
  chapterLabel: (n: number) => string;
  prevSummaryLabel: string;
  generateInstruction: string;
  categories: string;
  separator: string;
}

function getStrings(lang: Lang): PromptStrings {
  switch (lang) {
    case "en":
      return {
        suffix: "IMPORTANT: Output ONLY a pure JSON object. Do NOT include any explanation, greeting, or markdown code fences (like ```json). All field names must be in English.",
        roleEditor: "You are a senior fiction planning editor who excels at extracting compelling novel settings from a one-sentence concept.",
        roleWorldbuilder: "You are a professional novel worldbuilding architect.",
        roleCharacterDesigner: "You are a senior novel character designer.",
        roleOutlinePlanner: "You are a professional novel outline planner.",
        roleNovelist: "You are a talented novelist who excels at writing captivating novel chapters.",
        roleSummaryEditor: "You are a professional fiction editor who excels at distilling chapter summaries and tracking key plot points.",
        metadataFields: `You must return a strict JSON object with these fields:
- title: Novel title, 2-8 words, concise and attractive
- category: Novel category, choose one from: Fantasy, Urban, Xianxia, Sci-Fi, Sports, Historical, Mystery, Romance
- tags: Array of 5-8 tags, each 1-3 words, precisely capturing the novel's features
- summary: Novel synopsis, 150-300 words, including core setting, protagonist identity, central conflict, and hooks`,
        worldviewFields: `You must return a strict JSON object with this field:
- worldview: World description, about 500 words

The worldview must cover these four dimensions:
1. Era/Setting: When and where the story takes place, civilization level
2. Geography: Key locations, important places
3. Power system/Social rules: Special power systems or unique social rules
4. Core conflict: The fundamental conflict driving the story`,
        characterFields: `You must return a strict JSON object with these fields:
- name: Protagonist name, fitting the world's era and culture
- gender: Gender
- age: Age, a number
- personality: Personality traits, a string with 3-5 keywords separated by commas (example: "resilient, cunning, passionate, calm"). MUST be a string, NOT an array
- background: Backstory, about 200 words, covering origin, growth, turning points
- goal: Motivation, the protagonist's core pursuit and driving force
- appearance: Physical description, highlighting distinctive features`,
        outlineFields: `You must return a strict JSON object with this field:
- chapters: Array of chapters, each containing:
  - order: Chapter number, starting from 1
  - title: Chapter title, concise and attractive, under 10 words
  - summary: Chapter summary, 100-200 words, outlining main plot and twists`,
        antiHallucination: `Anti-hallucination requirements:
1. Strictly base content on the user's concept, do not introduce elements beyond the concept
2. Category and tags must match the concept theme
3. Synopsis settings must be derivable from the user's concept`,
        consistencyRules: `Consistency constraints:
1. Character names, place names must remain consistent once established
2. Worldview must match the novel category (${"{category}"}) and tags
3. Worldview must stay consistent with the concept and metadata
4. Power systems must have clear boundaries`,
        writingRules: `Writing requirements (strictly follow):
1. Follow the chapter outline title and summary closely
2. Use the protagonist name "${"{name}"}" throughout, personality must match: ${"{personality}"}
3. Use narrative prose with vivid dialogue, environment description, action, and inner thoughts
4. Do not introduce new characters or world elements unless mentioned in the outline
5. Chapter length: 2000-3000 words, substantial content with good pacing
6. End with a hook or twist to create suspense
7. Dialogue must match character identity and personality
8. Use third-person narrative perspective`,
        conceptLabel: "User's novel concept",
        metadataLabels: { title: "Title", category: "Category", tags: "Tags", summary: "Synopsis" },
        worldviewLabel: "Worldview setting",
        characterLabels: { name: "Name", gender: "Gender", age: "Age", personality: "Personality", background: "Background", goal: "Goal", appearance: "Appearance" },
        chapterLabel: (n) => `This is chapter ${n}`,
        prevSummaryLabel: "Previous chapters summary (ensure plot continuity)",
        generateInstruction: "Based on the above, generate the novel metadata JSON.",
        categories: "Fantasy, Urban, Xianxia, Sci-Fi, Sports, Historical, Mystery, Romance",
        separator: ", ",
      };
    case "ja":
      return {
        suffix: "重要：純粋なJSONオブジェクトのみを出力してください。説明、挨拶、マークダウンコードフェンス（```jsonなど）は含めないでください。フィールド名は英語でなければなりません。",
        roleEditor: "あなたはユーザーの一言の構想から魅力的な小説の設定を引き出すのが得意な、シニアな小説企画編集者です。",
        roleWorldbuilder: "あなたはプロの小説世界観アーキテクトです。",
        roleCharacterDesigner: "あなたはシニアな小説キャラクターデザイナーです。",
        roleOutlinePlanner: "あなたはプロの小説アウトラインプランナーです。",
        roleNovelist: "あなたは魅力的な小説の章を書くのが得意な才能ある小説家です。",
        roleSummaryEditor: "あなたは章の要約を抽出し、重要なプロットを追跡するのが得意なプロの小説編集者です。",
        metadataFields: `以下のフィールドを持つ厳密なJSONオブジェクトを返してください：
- title: 小説のタイトル、2-8語、簡潔で魅力的に
- category: 小説の分類、次の中から一つ選択：ファンタジー、都市、仙侠、SF、スポーツ、歴史、ミステリー、恋愛
- tags: 5-8個のタグの配列、各1-3語、小説の特徴を正確に捉える
- summary: 小説のあらすじ、150-300語、核心的な設定、主人公の身份、中心的な対立、見どころを含む`,
        worldviewFields: `以下のフィールドを持つ厳密なJSONオブジェクトを返してください：
- worldview: 世界観の説明、約500語

世界観の説明は以下の4つの次元を含む必要があります：
1. 時代背景：物語の時代、文明の発展度
2. 地理環境：主な舞台、重要な場所
3. 力体系/社会規則：特殊な力体系または独自の社会規則
4. 核心的矛盾：物語を推進する根本的な矛盾`,
        characterFields: `以下のフィールドを持つ厳密なJSONオブジェクトを返してください：
- name: 主人公の名前、世界観の時代に合った
- gender: 性別
- age: 年齢、数字
- personality: 性格特徴、カンマ区切りの3-5個のキーワード文字列（例：「勇敢, 聡明, 情熱的, 冷静」）。必ず文字列で、配列にしない
- background: 背景物語、約200語、生い立ち、成長经历、転換点
- goal: 目標動機、主人公の核心的な追求と行動驱动力
- appearance: 外見の説明、識別度のある特徴を`,
        outlineFields: `以下のフィールドを持つ厳密なJSONオブジェクトを返してください：
- chapters: 章の配列、各章は以下を含む：
  - order: 章番号、1から開始
  - title: 章タイトル、簡潔で魅力的、10語以内
  - summary: 章の要約、100-200語、本章の主なプロットと展開の概要`,
        antiHallucination: `幻覚防止要件：
1. ユーザーの構想に厳密に基づいて内容を生成し、構想外の要素を導入しない
2. 分類とタグは構想のテーマに一致する
3. あらすじの設定はユーザーの構想から導き出せる`,
        consistencyRules: `一貫性制約：
1. キャラクター名、地名は一度確定したら一貫性を保つ
2. 世界観は小説の分類（${"{category}"}）とタグに一致する
3. 世界観は構想とメタデータと一貫性を保つ
4. 力体系は明確な境界を持つ`,
        writingRules: `執筆要件（厳守）：
1. 章のアウトラインのタイトルと要約に厳密に従う
2. 主人公名「${"{name}"}」を一貫して使用、性格は設定と一致：${"{personality}"}
3. 小説の叙事体を使用、生动的な会話、環境描写、動作描写、心理描写を含む
4. アウトラインに言及されていない新しいキャラクターや世界要素を導入しない
5. 章の文字数：2000-3000字、充実した内容、適切なリズム
6. 章の終わりにフックや展開を入れ、読者が続きたくなる悬念を作る
7. セリフはキャラクターの身份と性格に合う
8. 三人称の視点で叙述`,
        conceptLabel: "ユーザーの小説構想",
        metadataLabels: { title: "タイトル", category: "分類", tags: "タグ", summary: "あらすじ" },
        worldviewLabel: "世界観設定",
        characterLabels: { name: "名前", gender: "性別", age: "年齢", personality: "性格", background: "背景", goal: "目標", appearance: "外見" },
        chapterLabel: (n) => `本章は第${n}章です`,
        prevSummaryLabel: "前章の要約（プロットの連続性を確保）",
        generateInstruction: "上記に基づいて、小説のメタデータJSONを生成してください。",
        categories: "ファンタジー、都市、仙侠、SF、スポーツ、歴史、ミステリー、恋愛",
        separator: "、",
      };
    case "ko":
      return {
        suffix: "중요: 순수한 JSON 객체만 출력하세요. 설명, 인사말, 마크다운 코드 펜스(```json 등)를 포함하지 마세요. 필드명은 영어여야 합니다.",
        roleEditor: "당신은 사용자의 한 문장 구상에서 매력적인 소설 설정을 끌어내는 데 능숙한 수석 소설 기획 편집자입니다.",
        roleWorldbuilder: "당신은 전문 소설 세계관 건축가입니다.",
        roleCharacterDesigner: "당신은 수석 소설 캐릭터 디자이너입니다.",
        roleOutlinePlanner: "당신은 전문 소설 아웃라인 플래너입니다.",
        roleNovelist: "당신은 매혹적인 소설 챕터를 쓰는 데 능숙한 재능 있는 소설가입니다.",
        roleSummaryEditor: "당신은 챕터 요약을 추출하고 핵심 플롯을 추적하는 데 능숙한 전문 소설 편집자입니다.",
        metadataFields: `다음 필드를 포함한 엄격한 JSON 객체를 반환하세요:
- title: 소설 제목, 2-8단어, 간결하고 매력적으로
- category: 소설 분류, 다음 중 하나 선택: 판타지, 도시, 선협, SF, 스포츠, 역사, 미스터리, 로맨스
- tags: 5-8개의 태그 배열, 각 1-3단어, 소설의 특징을 정확히 포착
- summary: 소설 시놉시스, 150-300단어, 핵심 설정, 주인공 정체성, 중심 갈등, 볼거리 포함`,
        worldviewFields: `다음 필드를 포함한 엄격한 JSON 객체를 반환하세요:
- worldview: 세계관 설명, 약 500단어

세계관 설명은 다음 4개 차원을 포함해야 합니다:
1. 시대적 배경: 이야기가 발생하는 시대, 문명 발전 수준
2. 지리 환경: 주요 무대, 중요한 장소
3. 힘 체계/사회 규칙: 특수한 힘 체계 또는 독특한 사회 규칙
4. 핵심 모순: 이야기를 추진하는 근본적 모순`,
        characterFields: `다음 필드를 포함한 엄격한 JSON 객체를 반환하세요:
- name: 주인공 이름, 세계관 시대에 맞게
- gender: 성별
- age: 나이, 숫자
- personality: 성격 특징, 쉼표로 구분된 3-5개 키워드 문자열 (예: "용감함, 영리함, 열정적, 냉철함"). 반드시 문자열, 배열 금지
- background: 배경 스토리, 약 200단어, 출신, 성장 과정, 전환점
- goal: 목표 동기, 주인공의 핵심 추구와 행동 동력
- appearance: 외모 묘사, 식별 가능한 특징 강조`,
        outlineFields: `다음 필드를 포함한 엄격한 JSON 객체를 반환하세요:
- chapters: 챕터 배열, 각 챕터 포함:
  - order: 챕터 번호, 1부터 시작
  - title: 챕터 제목, 간결하고 매력적, 10단어 이내
  - summary: 챕터 요약, 100-200단어, 주요 줄거리와 전개 개요`,
        antiHallucination: `환각 방지 요구사항:
1. 사용자의 구상에 엄격히 기반하여 내용을 생성, 구상 외 요소 도입 금지
2. 분류와 태그는 구상 테마와 일치
3. 시놉시스 설정은 사용자 구상에서 유도 가능`,
        consistencyRules: `일관성 제약:
1. 캐릭터 이름, 지명은 일단 확정되면 일관성 유지
2. 세계관은 소설 분류(${"{category}"}) 및 태그와 일치
3. 세계관은 구상 및 메타데이터와 일관성 유지
4. 힘 체계는 명확한 경계 가져야`,
        writingRules: `집필 요구사항 (엄격히 준수):
1. 챕터 아웃라인 제목과 요약을 엄격히 따름
2. 주인공 이름 "${"{name}"}"을 일관되게 사용, 성격은 설정과 일치: ${"{personality}"}
3. 소설 서사체 사용, 생생한 대화, 환경 묘사, 행동 묘사, 심리 묘사 포함
4. 아웃라인에 언급되지 않은 새 캐릭터나 세계 요소 도입 금지
5. 챕터 분량: 2000-3000자, 충실한 내용, 적절한 페이싱
6. 마지막에 훅이나 반전으로 독자가 계속 읽고 싶게 만드는悬念
7. 대사는 캐릭터 정체성과 성격에 맞게
8. 3인칭 시점 서술`,
        conceptLabel: "사용자의 소설 구상",
        metadataLabels: { title: "제목", category: "분류", tags: "태그", summary: "시놉시스" },
        worldviewLabel: "세계관 설정",
        characterLabels: { name: "이름", gender: "성별", age: "나이", personality: "성격", background: "배경", goal: "목표", appearance: "외모" },
        chapterLabel: (n) => `이 장은 제${n}장입니다`,
        prevSummaryLabel: "이전 챕터 요약 (플롯 연속성 보장)",
        generateInstruction: "위 정보를 바탕으로 소설 메타데이터 JSON을 생성하세요.",
        categories: "판타지, 도시, 선협, SF, 스포츠, 역사, 미스터리, 로맨스",
        separator: ", ",
      };
    case "zh-TW":
      return {
        suffix: "重要：請只輸出純JSON物件，不要輸出任何解釋、說明、問候語或markdown代碼塊標記（如```json）。欄位名必須使用英文。",
        roleEditor: "你是一位資深小說策劃編輯，擅長從用戶的一句話構想中提煉出精彩的小說設定。",
        roleWorldbuilder: "你是一位專業的小說世界觀架構師。",
        roleCharacterDesigner: "你是一位資深小說人物設計師。",
        roleOutlinePlanner: "你是一位專業小說大綱策劃師。",
        roleNovelist: "你是一位才華橫溢的小說作家，擅長創作引人入勝的小說章節內容。",
        roleSummaryEditor: "你是一位專業的小說編輯，擅長提煉章節摘要和追蹤關鍵情節。",
        metadataFields: `你必須嚴格返回JSON格式，包含以下欄位：
- title: 小說名，2-8個字，簡潔有力吸引人
- category: 小說分類，必須從以下選項中選擇一個：玄幻、都市、仙俠、科幻、競技、歷史、懸疑、言情
- tags: 標籤陣列，5-8個標籤，每個標籤2-4個字，精準概括小說特色
- summary: 小說簡介，200-300字，包含故事核心設定、主角身份、核心衝突和看點`,
        worldviewFields: `你必須嚴格返回JSON格式，包含以下欄位：
- worldview: 世界觀描述，500字左右

世界觀描述必須包含以下四個維度：
1. 時代背景：故事發生的時代、文明發展程度
2. 地理環境：主要場景所在的地理環境、重要地點
3. 力量體系/社會規則：該世界的特殊力量體系或獨特社會規則
4. 核心矛盾：驅動故事發展的根本矛盾`,
        characterFields: `你必須嚴格返回JSON格式，包含以下欄位：
- name: 主角姓名，符合世界觀時代背景
- gender: 性別（男/女/其他）
- age: 年齡，數字
- personality: 性格特點，字串類型，用頓號（、）分隔3-5個關鍵詞（示例值：「堅韌、隱忍、機智、熱血、冷靜」），注意：必須是字串，不要用陣列格式
- background: 背景故事，200字左右，交代身世、成長經歷、轉折事件
- goal: 目標動機，主角在故事中的核心追求和行動驅動力
- appearance: 外貌描述，突出辨識度的特徵`,
        outlineFields: `你必須嚴格返回JSON格式，包含以下欄位：
- chapters: 章節陣列，每個章節包含：
  - order: 章節序號，從1開始
  - title: 章節標題，簡潔吸引人，10字以內
  - summary: 章節摘要，100-200字，概述本章主要情節和轉折`,
        antiHallucination: `防幻覺要求：
1. 嚴格基於用戶提供的構想生成內容，不得引入構想之外的元素
2. 分類和標籤必須與構想主題相符
3. 簡介中的設定必須能從用戶構想中推導出來`,
        consistencyRules: `一致性約束：
1. 角色名、地名等專有名詞一旦確定必須保持一致
2. 世界觀設定必須與小說分類(${"{category}"})和標籤相符
3. 世界觀必須與用戶構想和元數據保持一致，不得引入無關設定
4. 力量體系/社會規則要有明確邊界`,
        writingRules: `寫作要求（必須嚴格遵守）：
1. 嚴格按照當前章節的大綱標題和摘要撰寫，不得偏離大綱內容
2. 主角名字必須全程使用「${"{name}"}」，性格特徵必須與設定一致：${"{personality}"}
3. 使用小說敘事體，包含生動的對話、細膩的環境描寫、精彩的動作描寫和心理活動
4. 不引入設定外的新角色和新世界觀元素，除非大綱中明確提及
5. 本章字數要求：2000-3000字，內容充實，節奏得當
6. 章節結尾必須有鉤子或轉折，製造懸念吸引讀者繼續閱讀
7. 對話要符合人物身份和性格，描寫要符合世界觀設定
8. 敘事視角以第三人稱為主，可適當穿插主角視角的心理描寫`,
        conceptLabel: "用戶的小說構想",
        metadataLabels: { title: "標題", category: "分類", tags: "標籤", summary: "簡介" },
        worldviewLabel: "世界觀設定",
        characterLabels: { name: "姓名", gender: "性別", age: "年齡", personality: "性格", background: "背景", goal: "目標", appearance: "外貌" },
        chapterLabel: (n) => `本章是第${n}章`,
        prevSummaryLabel: "前情提要（前面章節的摘要，確保情節連貫）",
        generateInstruction: "請根據以上構想，生成符合要求的小說元數據JSON。",
        categories: "玄幻、都市、仙俠、科幻、競技、歷史、懸疑、言情",
        separator: "、",
      };
    case "zh-CN":
    default:
      return {
        suffix: "重要：请只输出纯JSON对象，不要输出任何解释、说明、问候语或markdown代码块标记（如```json）。字段名必须使用英文。",
        roleEditor: "你是一位资深小说策划编辑，擅长从用户的一句话构想中提炼出精彩的小说设定。",
        roleWorldbuilder: "你是一位专业的小说世界观架构师。",
        roleCharacterDesigner: "你是一位资深小说人物设计师。",
        roleOutlinePlanner: "你是一位专业小说大纲策划师。",
        roleNovelist: "你是一位才华横溢的小说作家，擅长创作引人入胜的小说章节内容。",
        roleSummaryEditor: "你是一位专业的小说编辑，擅长提炼章节摘要和追踪关键情节。",
        metadataFields: `你必须严格返回JSON格式，包含以下字段：
- title: 小说名，2-8个字，简洁有力吸引人
- category: 小说分类，必须从以下选项中选择一个：玄幻、都市、仙侠、科幻、竞技、历史、悬疑、言情
- tags: 标签数组，5-8个标签，每个标签2-4个字，精准概括小说特色
- summary: 小说简介，200-300字，包含故事核心设定、主角身份、核心冲突和看点`,
        worldviewFields: `你必须严格返回JSON格式，包含以下字段：
- worldview: 世界观描述，500字左右

世界观描述必须包含以下四个维度：
1. 时代背景：故事发生的时代、文明发展程度
2. 地理环境：主要场景所在的地理环境、重要地点
3. 力量体系/社会规则：该世界的特殊力量体系或独特社会规则
4. 核心矛盾：驱动故事发展的根本矛盾`,
        characterFields: `你必须严格返回JSON格式，包含以下字段：
- name: 主角姓名，符合世界观时代背景
- gender: 性别（男/女/其他）
- age: 年龄，数字
- personality: 性格特点，字符串类型，用顿号（、）分隔3-5个关键词（示例值："坚韧、隐忍、机智、热血、冷静"），注意：必须是字符串，不要用数组格式
- background: 背景故事，200字左右，交代身世、成长经历、转折事件
- goal: 目标动机，主角在故事中的核心追求和行动驱动力
- appearance: 外貌描述，突出辨识度的特征`,
        outlineFields: `你必须严格返回JSON格式，包含以下字段：
- chapters: 章节数组，每个章节包含：
  - order: 章节序号，从1开始
  - title: 章节标题，简洁吸引人，10字以内
  - summary: 章节摘要，100-200字，概述本章主要情节和转折`,
        antiHallucination: `防幻觉要求：
1. 严格基于用户提供的构想生成内容，不得引入构想之外的元素
2. 分类和标签必须与构想主题相符
3. 简介中的设定必须能从用户构想中推导出来`,
        consistencyRules: `一致性约束：
1. 角色名、地名等专有名词一旦确定必须保持一致
2. 世界观设定必须与小说分类(${"{category}"})和标签相符
3. 世界观必须与用户构想和元数据保持一致，不得引入无关设定
4. 力量体系/社会规则要有明确边界`,
        writingRules: `写作要求（必须严格遵守）：
1. 严格按照当前章节的大纲标题和摘要撰写，不得偏离大纲内容
2. 主角名字必须全程使用"${"{name}"}"，性格特征必须与设定一致：${"{personality}"}
3. 使用小说叙事体，包含生动的对话、细腻的环境描写、精彩的动作描写和心理活动
4. 不引入设定外的新角色和新世界观元素，除非大纲中明确提及
5. 本章字数要求：2000-3000字，内容充实，节奏得当
6. 章节结尾必须有钩子或转折，制造悬念吸引读者继续阅读
7. 对话要符合人物身份和性格，描写要符合世界观设定
8. 叙事视角以第三人称为主，可适当穿插主角视角的心理描写`,
        conceptLabel: "用户的小说构想",
        metadataLabels: { title: "标题", category: "分类", tags: "标签", summary: "简介" },
        worldviewLabel: "世界观设定",
        characterLabels: { name: "姓名", gender: "性别", age: "年龄", personality: "性格", background: "背景", goal: "目标", appearance: "外貌" },
        chapterLabel: (n) => `本章是第${n}章`,
        prevSummaryLabel: "前情提要（前面章节的摘要，确保情节连贯）",
        generateInstruction: "请根据以上构想，生成符合要求的小说元数据JSON。",
        categories: "玄幻、都市、仙侠、科幻、竞技、历史、悬疑、言情",
        separator: "、",
      };
  }
}

export interface NovelMetadata {
  title: string;
  category: string;
  tags: string[];
  summary: string;
}

export interface NovelCharacter {
  name: string;
  gender: string;
  age: number;
  personality: string;
  background: string;
  goal: string;
  appearance: string;
}

export interface OutlineChapter {
  order: number;
  title: string;
  summary: string;
}

export interface ChapterSummary {
  summary: string;
  characters: string[];
  keyEvents: string[];
}

export function buildMetadataPrompt(
  concept: string,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const s = getStrings(detectLang(locale));
  const systemPrompt = `${s.roleEditor}
${s.metadataFields}

${s.antiHallucination}

${s.suffix}`;

  const prompt = `${s.conceptLabel}：${concept}

${s.generateInstruction}`;

  return { systemPrompt, prompt };
}

export function buildWorldviewPrompt(
  concept: string,
  metadata: NovelMetadata,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const s = getStrings(detectLang(locale));
  const sep = s.separator;
  const systemPrompt = `${s.roleWorldbuilder}
${s.worldviewFields}

${s.consistencyRules.replace("{category}", metadata.category)}

${s.antiHallucination}

${s.suffix}`;

  const prompt = `${s.conceptLabel}：${concept}

${s.metadataLabels.title}：${metadata.title}
${s.metadataLabels.category}：${metadata.category}
${s.metadataLabels.tags}：${metadata.tags.join(sep)}
${s.metadataLabels.summary}：${metadata.summary}

请基于以上信息，生成完整的世界观设定JSON。`;

  return { systemPrompt, prompt };
}

export function buildCharacterPrompt(
  concept: string,
  metadata: NovelMetadata,
  worldview: string,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const s = getStrings(detectLang(locale));
  const sep = s.separator;
  const systemPrompt = `${s.roleCharacterDesigner}
${s.characterFields}

${s.antiHallucination}

${s.suffix}`;

  const prompt = `${s.conceptLabel}：${concept}

${s.metadataLabels.title}：${metadata.title}
${s.metadataLabels.category}：${metadata.category}
${s.metadataLabels.tags}：${metadata.tags.join(sep)}
${s.metadataLabels.summary}：${metadata.summary}

${s.worldviewLabel}：
${worldview}

请基于以上信息，设计主角设定JSON。`;

  return { systemPrompt, prompt };
}

export function buildOutlinePrompt(
  concept: string,
  metadata: NovelMetadata,
  worldview: string,
  character: NovelCharacter,
  chapterCount: number = 10,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const s = getStrings(detectLang(locale));
  const sep = s.separator;
  const systemPrompt = `${s.roleOutlinePlanner}
${s.outlineFields}

${s.consistencyRules.replace("{category}", metadata.category).replace("{character_name}", character.name)}

${s.suffix}`;

  const prompt = `${s.conceptLabel}：${concept}

${s.metadataLabels.title}：${metadata.title}
${s.metadataLabels.category}：${metadata.category}
${s.metadataLabels.tags}：${metadata.tags.join(sep)}
${s.metadataLabels.summary}：${metadata.summary}

${s.worldviewLabel}：
${worldview}

${s.characterLabels.name}：${character.name}
${s.characterLabels.gender}：${character.gender}
${s.characterLabels.age}：${character.age}
${s.characterLabels.personality}：${character.personality}
${s.characterLabels.background}：${character.background}
${s.characterLabels.goal}：${character.goal}
${s.characterLabels.appearance}：${character.appearance}

请规划${chapterCount}章的完整章节大纲JSON。`;

  return { systemPrompt, prompt };
}

export function buildChapterPrompt(
  metadata: NovelMetadata,
  worldview: string,
  character: NovelCharacter,
  outlineChapters: Array<{ title: string; summary: string }>,
  previousChaptersSummary: string,
  chapterIndex: number,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const s = getStrings(detectLang(locale));
  const currentChapter = outlineChapters[chapterIndex];
  const writingRules = s.writingRules
    .replace("{name}", character.name)
    .replace("{personality}", character.personality);

  const systemPrompt = `${s.roleNovelist}

${writingRules}

重要：返回纯文本小说内容，不要返回JSON格式，不要加markdown标记，直接输出正文。`;

  const prevSummarySection = previousChaptersSummary
    ? `${s.prevSummaryLabel}：
${previousChaptersSummary}

`
    : "";

  const prompt = `${s.metadataLabels.title}：${metadata.title}
${s.metadataLabels.category}：${metadata.category}

${s.worldviewLabel}：
${worldview}

${s.characterLabels.name}：${character.name}
${s.characterLabels.gender}：${character.gender}
${s.characterLabels.personality}：${character.personality}
${s.characterLabels.background}：${character.background}
${s.characterLabels.goal}：${character.goal}
${s.characterLabels.appearance}：${character.appearance}

${prevSummarySection}${s.chapterLabel(chapterIndex + 1)}，章节大纲如下：
标题：${currentChapter.title}
摘要：${currentChapter.summary}

请根据以上所有信息，撰写本章节的完整正文内容。`;

  return { systemPrompt, prompt };
}

export function buildChapterSummaryPrompt(
  chapterContent: string
): { systemPrompt: string; prompt: string } {
  const systemPrompt = `你是一位专业的小说编辑，擅长提炼章节摘要和追踪关键情节。
请阅读给定的小说章节内容，生成精炼的摘要和关键信息。
你必须严格返回JSON格式，包含以下字段：
- summary: 章节摘要，50-100字，精炼概括本章主要情节
- characters: 本章出现的角色名字数组
- keyEvents: 本章的关键事件数组（每个事件简短描述），用于追踪伏笔和情节线索

要求：
1. 摘要要准确概括本章核心内容，不遗漏重要转折
2. 角色名要准确，只列出本章实际出场的角色
3. 关键事件要标注伏笔、冲突、转折、重要信息揭露等

重要：请只输出纯JSON对象，不要输出任何解释、说明、问候语或markdown代码块标记（如\`\`\`json）。字段名必须使用英文。`;

  const prompt = `小说章节内容：
${chapterContent}

请提炼本章的摘要、出场角色和关键事件JSON。`;

  return { systemPrompt, prompt };
}

export function buildQuickChapterPrompt(
  concept: string,
  metadata: NovelMetadata,
  chapters: Array<{ title: string; summary: string }>,
  chapterIndex: number,
  previousChaptersSummary?: string,
  locale?: string
): { systemPrompt: string; prompt: string } {
  const s = getStrings(detectLang(locale));
  const sep = s.separator;
  const currentChapter = chapters[chapterIndex];
  const systemPrompt = `${s.roleNovelist}

${s.writingRules.replace("{name}", "主角").replace("{personality}", "与设定一致")}

重要：返回纯文本小说内容，不要返回JSON格式，不要加markdown标记，直接输出正文。`;

  const prevSummarySection = previousChaptersSummary
    ? `${s.prevSummaryLabel}：
${previousChaptersSummary}

`
    : "";

  const prompt = `${s.conceptLabel}：${concept}

${s.metadataLabels.title}：${metadata.title}
${s.metadataLabels.category}：${metadata.category}
${s.metadataLabels.tags}：${metadata.tags.join(sep)}
${s.metadataLabels.summary}：${metadata.summary}

${prevSummarySection}${s.chapterLabel(chapterIndex + 1)}，章节大纲如下：
标题：${currentChapter.title}
摘要：${currentChapter.summary}

请根据以上信息，撰写本章节的完整正文内容。`;

  return { systemPrompt, prompt };
}
