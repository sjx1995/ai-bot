/*
 * @Description: 所有过往消息
 * @Author: Sunly
 * @Date: 2023-07-18 15:42:10
 */
enum Role {
  SYSTEM = "system",
  SAME_USER = "same_user",
  ASSISTANT = "assistant",
  USER = "user",
}

const messages: { role: Role; content: string }[] = [];

const addMessage = (role: Role, content: string) => {
  messages.push({ role, content });
};

const addQuestion = (msg: string) => {
  if (messages.length === 1) {
    if (messages[0].role === Role.SAME_USER) {
      messages[0].role = Role.SYSTEM;
      messages[0].content = msg;
    }
  }
  addMessage(Role.USER, msg);
};

const addAnswer = (msg: string) => {
  addMessage(Role.ASSISTANT, msg);
};

const addSystem = (msg: string, isSameUser: boolean) => {
  addMessage(isSameUser ? Role.SAME_USER : Role.SYSTEM, msg);
};

const getMessages = () => {
  return messages;
};

const getLastAnswer = () => {
  const lastAnswer = messages.filter((msg) => msg.role === Role.ASSISTANT);
  return lastAnswer.length > 0
    ? lastAnswer[lastAnswer.length - 1].content
    : null;
};

export { addQuestion, addAnswer, addSystem, getMessages, getLastAnswer };
