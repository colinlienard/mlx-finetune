# mlx-fine-tune

Download dataset:

```bash
huggingface-cli download HuggingFaceH4/ultrachat_200k --repo-type dataset --local-dir dataset
```

Format data:

```bash
bun format.ts
```

Then split data:

```bash
bun split.ts
```

Train:

```bash
pip install mlx-lm
```

```bash
mlx_lm.lora --train \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-Instruct-v0.2/snapshots/3ad372fc79158a2148299e3318516c786aeded6c \
--data data \
--batch-size 1
```

Test:

```bash
mlx_lm.generate \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-Instruct-v0.2/snapshots/3ad372fc79158a2148299e3318516c786aeded6c \
--max-tokens 500 \
--adapter-path adapters \
--prompt "Create a basic svelte counter component"
```

Merge to existing model:

```bash
mlx_lm.fuse \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-Instruct-v0.2/snapshots/3ad372fc79158a2148299e3318516c786aeded6c \
--adapter-path adapters \
--save-path fused \
--de-quantize
```

Convert to gguf:

```bash
cd ..
git clone git@github.com:ggml-org/llama.cpp.git
cd llama.cpp
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python convert_hf_to_gguf.py ../mlx-fine-tune/fused \
--outfile ../mlx-fine-tune/mymodel.gguf \
--outtype q8_0
```

Create Ollama model:

```bash
ollama create mymodel -f Modelfile
```
