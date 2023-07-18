/*
 * @Description: 所有过往消息
 * @Author: Sunly
 * @Date: 2023-07-18 15:42:10
 */
enum Role {
  SYSTEM = "system",
  USER = "user",
}

const messages: { role: Role; content: string }[] = [];

const addMessage = (role: Role, content: string) => {
  messages.push({ role, content });
};

const addQuestion = (msg: string) => {
  addMessage(Role.USER, msg);
};

const addAnswer = (msg: string) => {
  addMessage(Role.SYSTEM, msg);
};

const getMessages = () => {
  return messages;
};

export { addQuestion, addAnswer, getMessages };
