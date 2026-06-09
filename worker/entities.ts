import { IndexedEntity } from "./core-utils";
import type { User, Brand, Customer, Order, Pincode, Chat, ChatMessage } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class BrandEntity extends IndexedEntity<Brand> {
  static readonly entityName = "brand";
  static readonly indexName = "brands";
  static readonly initialState: Brand = { id: "", name: "", planId: "starter", status: "active", createdAt: "" };
}
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static readonly indexName = "customers";
  static readonly initialState: Customer = { id: "", name: "", email: "", brandId: "", orderCount: 0, rtoCount: 0, trustScore: 50 };
}
export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = { id: "", orderNumber: "", amount: 0, customerId: "", brandId: "", status: "pending", rtoRisk: "low", recommendation: "Ship", createdAt: "", pincode: "" };
}
export class PincodeEntity extends IndexedEntity<Pincode> {
  static readonly entityName = "pincode";
  static readonly indexName = "pincodes";
  static readonly initialState: Pincode = { id: "", code: "", city: "", state: "", rtoRate: 0 };
  static seedData: Pincode[] = [
    { id: "110001", code: "110001", city: "Delhi", state: "Delhi", rtoRate: 8.5 },
    { id: "400001", code: "400001", city: "Mumbai", state: "Maharashtra", rtoRate: 12.1 },
    { id: "560001", code: "560001", city: "Bangalore", state: "Karnataka", rtoRate: 6.2 },
    { id: "800001", code: "800001", city: "Patna", state: "Bihar", rtoRate: 24.8 }
  ];
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}