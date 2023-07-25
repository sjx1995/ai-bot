/*
 * @Description: 所有过往消息
 * @Author: Sunly
 * @Date: 2023-07-18 15:42:10
 */
enum EnumRole {
  SYSTEM = "system",
  SAME_USER = "same_user",
  ASSISTANT = "assistant",
  USER = "user",
}

const messages: { role: EnumRole; content: string }[] = [];

const addMessage = (role: EnumRole, content: string) => {
  messages.push({ role, content });
};

const addQuestion = (msg: string) => {
  if (messages.length === 1) {
    if (messages[0].role === EnumRole.SAME_USER) {
      messages[0].role = EnumRole.SYSTEM;
      messages[0].content = msg;
    }
  }
  addMessage(EnumRole.USER, msg);
};

const addAnswer = (msg: string) => {
  addMessage(EnumRole.ASSISTANT, msg);
};

const addSystem = (msg: string, isSameUser: boolean) => {
  addMessage(isSameUser ? EnumRole.SAME_USER : EnumRole.SYSTEM, msg);
};

const getMessages = () => {
  return messages;
};

const getLastAnswer = () => {
  const lastAnswer = messages.filter((msg) => msg.role === EnumRole.ASSISTANT);
  return lastAnswer.length > 0
    ? lastAnswer[lastAnswer.length - 1].content
    : null;
};

export {
  EnumRole,
  addQuestion,
  addAnswer,
  addSystem,
  getMessages,
  getLastAnswer,
};
