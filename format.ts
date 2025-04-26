import { writeFileSync } from "fs";

interface Conversation {
  from: string;
  value: string;
}

interface ConversationData {
  conversations: Conversation[];
}

const raw = await Bun.file("./dataset/raw.jsonl").text();
const lines = raw.split("\n").filter((line) => line.trim() !== "");

const formattedLines: string[] = lines.map((line) => {
  const data: ConversationData = JSON.parse(line);
  const prompt =
    data.conversations.find((conv) => conv.from === "human")?.value || "";
  const completion =
    data.conversations.find((conv) => conv.from === "gpt")?.value || "";
  const text = "[INST]" + prompt + "[/INST]" + completion;
  return JSON.stringify({ text });
});

const formattedText = formattedLines.join("\n");

writeFileSync("./dataset/formatted.jsonl", formattedText);
