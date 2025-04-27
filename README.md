# mlx-fine-tune

## Data Preparation

Download dataset:

```bash
huggingface-cli download dataset-name --repo-type dataset --local-dir dataset
```

Format data:

```bash
bun format.ts --input dataset.jsonl
```

## Fine-tuning

Install `mlx`:

```bash
pip install mlx-lm
```

Train:

```bash
mlx_lm.lora --train \
--model ./codestral-quantized \
--data data \
--batch-size 1 \
--num-layers 4 \
--test
```

Convert to quantized if not enough memory while training:

```bash
mlx_lm.convert --hf-path mistralai/Codestral-22B-v0.1 -q --mlx-path codestral-quantized
```

Prompt:

```bash
mlx_lm.generate \
--model ./codestral-quantized \
--max-tokens 500 \
--adapter-path adapters \
--prompt "Create a basic svelte counter component using runes"
```

## Use in Ollama

Merge to existing model:

```bash
mlx_lm.fuse \
--model ./codestral-quantized \
--adapter-path adapters \
--save-path fused \
--de-quantize
```

Convert to `.gguf`:

<details>

<summary>Setup llama.cpp</summary>

```bash
git clone git@github.com:ggml-org/llama.cpp.git
cd llama.cpp
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

</details>

```bash
python convert_hf_to_gguf.py ../mlx-fine-tune/fused \
--outfile ../mlx-fine-tune/mymodel.gguf \
--outtype q8_0
```

Create Ollama model:

```bash
ollama create mymodel -f Modelfile
```
