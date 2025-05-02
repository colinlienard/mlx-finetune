import csv from 'csvtojson';
import { getFlag } from 'type-flag';

const input = getFlag('--input', String);
if (!input) {
  console.error('Input file path is required.');
  process.exit(1);
}

const raw = await Bun.file(input).text();

const rawLines = await (async () => {
  switch (input.split('.').pop()) {
    case 'json':
      return parseJSON(raw);
    case 'jsonl':
      return parseJSONL(raw);
    case 'csv':
      return await parseCSV(raw);
    default:
      throw new Error('Unsupported file format');
  }
})();

const lines: string[] = rawLines.map(([prompt, completion]) => {
  const text = '[INST]' + prompt + '[/INST]' + completion;
  return JSON.stringify({ text });
});

const train = lines.slice(0, (lines.length / 10) * 6);
const valid = lines.slice((lines.length / 10) * 6, (lines.length / 10) * 8);
const test = lines.slice((lines.length / 10) * 8);

await Promise.all([
  Bun.write('./data/train.jsonl', train.join('\n')),
  Bun.write('./data/valid.jsonl', valid.join('\n')),
  Bun.write('./data/test.jsonl', test.join('\n')),
]);

function parseJSON(raw: string) {
  const array: { question: string; context: string; answer: string }[] = JSON.parse(raw);
  return array.map((item) => {
    const prompt = item.question + ' Given this context: ' + item.context;
    return [prompt, item.answer];
  });
}

function parseJSONL(raw: string): [string, string][] {
  const lines = raw.split('\n').filter((line) => line.trim() !== '');
  return lines.map((line) => {
    const data: { conversations: { from: string; value: string }[] } = JSON.parse(line);
    const prompt = data.conversations.find((conv) => conv.from === 'human')?.value || '';
    const completion = data.conversations.find((conv) => conv.from === 'gpt')?.value || '';
    return [prompt, completion];
  });
}

async function parseCSV(raw: string): Promise<[string, string][]> {
  const lines: Record<string, string>[] = await csv().fromString(raw);
  return lines.map((line) => Object.values(line)) as [string, string][];
}
