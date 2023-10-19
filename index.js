const jwt_token = process.env.DUOLINGO_JWT
if (!jwt_token){
    throw "NO DUOLINGO_JWT FOUND"
}
const lessons = process.env.LESSONS ?? 1
if (isNaN(lessons)){
    throw "LESSONS SHOULD BE NUMBER"
}

const headers = {
  'user-agent': 'curl/7.86.0',
  'Content-Type': 'application/json', 
  Authorization: `Bearer ${jwt_token}`,
  Host: 'www.duolingo.com',
  accept: '*/*',
  credentials: "include"
}

const { sub } = JSON.parse(
  Buffer.from(jwt_token.split('.')[1], 'base64').toString(),
)

const { fromLanguage, learningLanguage, xpGains } = await fetch(
  `https://www.duolingo.com/2017-06-30/users/${sub}?fields=fromLanguage,learningLanguage,xpGains`,
  {
    headers,
  },
  ).then(response => {
    if(response.status !== 200 ){
      console.log(response.body)
      throw Error('status not ok', response.statusText)
    } 
    return response.json()
  })



for (let i = 0; i < lessons; i++) {
const skillId = xpGains.find(xpGain => xpGain.skillId).skillId

const body = {
  challengeTypes: [
    "assist",
    "characterIntro",
    "characterMatch",
    "characterPuzzle",
    "characterSelect",
    "characterTrace",
    "completeReverseTranslation",
    "definition",
    "dialogue",
    "form",
    "freeResponse",
    "gapFill",
    "judge",
    "listen",
    "listenComplete",
    "listenMatch",
    "match",
    "name",
    "listenComprehension",
    "listenIsolation",
    "listenSpeak",
    "listenTap",
    "partialListen",
    "partialReverseTranslate",
    "patternTapComplete",
    "readComprehension",
    "select",
    "selectPronunciation",
    "selectTranscription",
    "syllableTap",
    "syllableListenTap",
    "speak",
    "tapCloze",
    "tapClozeTable",
    "tapComplete",
    "tapCompleteTable",
    "tapDescribe",
    "translate",
    "transliterate",
    "typeCloze",
    "typeClozeTable",
    "typeCompleteTable",
    "writeComprehension"
  ],
  fromLanguage,
  isFinalLevel: false,
  isV2: true,
  juicy: true,
  learningLanguage,
  smartTipsVersion: 2,
  skillId,
  type: "LISTENING_PRACTICE",
};



  const session = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
    body: JSON.stringify(body),
    headers,
    method: 'POST',
  }).then(response => {
    if(response.status !== 200 ){
                console.log(response)
      throw `Error calling POST /session : ${response.statusText}`
    } 
    return response.json()
  })

  const response = await fetch(
    `https://www.duolingo.com/2017-06-30/sessions/${session.id}`,
    {
      body: JSON.stringify({
        ...session,
        heartsLeft: 0,
        startTime: (+new Date() - 60000) / 1000,
        enableBonusPoints: false,
        endTime: +new Date() / 1000,
        failed: false,
        maxInLessonStreak: 9,
        shouldLearnThings: true,
      }),
      headers,
      method: 'PUT',
    },
  ).then(response => {
    if(response.status !== 200 ){
      throw `Error calling PUT /session : ${response.statusText}`
    } 
    return response.json()
  })

  console.log({ xp: response.xpGain })
}
