export const emailRegex = /^[a-z0-9]{1,50}@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/
export const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*[\d\W_])([a-zA-Z\d\W_])(?!.*[ㄱ-ㅎㅏ-ㅣ가-힣])[a-zA-Z\d\W_]{6,20}$|^(?=.*[a-zA-Z\d])(?=.*[\W_])([a-zA-Z\d\W_])(?!.*[ㄱ-ㅎㅏ-ㅣ가-힣])[a-zA-Z\d\W_]{6,20}$/
export const nicknameRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/
export const statusMessageRegex =
  /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s!@#\$%\^&\*\(\)_\-\+=~]+$/
