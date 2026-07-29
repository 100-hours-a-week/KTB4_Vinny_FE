export const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,20}$/;

export function getEmailError(email) {
  if (email === "") {
    return "* 이메일을 입력해주세요";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "* 올바른 이메일 주소 형식을 입력해주세요 (예: example@example.com)";
  }

  return "";
}

export function getPasswordError(password, confirmPassword = null) {
  if (password === "") {
    return "* 비밀번호를 입력해주세요";
  }

  if (!PASSWORD_PATTERN.test(password)) {
    return "* 비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
  }

  if (
    confirmPassword !== null &&
    confirmPassword !== "" &&
    password !== confirmPassword
  ) {
    return "* 비밀번호 확인과 다릅니다.";
  }

  return "";
}

export function getConfirmPasswordError(password, confirmPassword) {
  if (confirmPassword === "") {
    return "* 비밀번호를 한번 더 입력해주세요";
  }

  if (password !== confirmPassword) {
    return "* 비밀번호와 다릅니다.";
  }

  return "";
}

export function getNicknameError(nickname) {
  if (nickname === "") {
    return "* 닉네임을 입력해주세요";
  }

  if (/\s/.test(nickname)) {
    return "* 띄어쓰기를 없애주세요";
  }

  if (nickname.length < 2) {
    return "* 닉네임은 최소 2자 이상 작성해야 합니다.";
  }

  if (nickname.length > 10) {
    return "* 닉네임은 최대 10자까지 작성 가능합니다.";
  }

  return "";
}