# MLX Fine-tune

## Data Preparation

### Download Dataset

```bash
huggingface-cli download {dataset-name} --repo-type dataset --local-dir dataset
```

### Format Data

```bash
bun format.ts --input {dataset-file}
```

## Fine-tuning

### Install `mlx`

```bash
pip install mlx-lm
```

### Fine-tune

```bash
mlx_lm.lora \
--train \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-v0.3/snapshots/d8cadc02ac76bd617a919d50b092e59d2d110aff \
--data data \
--batch-size 1 \
```

> [!NOTE]
>
> Convert to quantized if not enough memory while training:
>
> ```bash
> mlx_lm.convert \
> -q \
> --hf-path mistralai/Mistral-7B-v0.3 \
> --mlx-path codestral-quantized
> ```

### Evaluate

```bash
mlx_lm.lora \
--test \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-v0.3/snapshots/d8cadc02ac76bd617a919d50b092e59d2d110aff \
--data data \
--adapter-path adapters \
```

### Prompt

```bash
mlx_lm.generate \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-v0.3/snapshots/d8cadc02ac76bd617a919d50b092e59d2d110aff \
--max-tokens 500 \
--adapter-path adapters \
--prompt "Please show the themes of competitions with host cities having populations larger than 1000, with this context: CREATE TABLE city (City_ID VARCHAR, Population INTEGER); CREATE TABLE farm_competition (Theme VARCHAR, Host_city_ID VARCHAR)"
```

## Use in Ollama

### Fuse

```bash
mlx_lm.fuse \
--model ~/.cache/huggingface/hub/models--mistralai--Mistral-7B-v0.3/snapshots/d8cadc02ac76bd617a919d50b092e59d2d110aff \
--adapter-path adapters \
--save-path fused \
--export-gguf # Not working in ollama
```

<details>

<summary>Or convert to GGUF with llama.cpp</summary>

Setup:

```bash
git clone git@github.com:ggml-org/llama.cpp.git
cd llama.cpp
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Convert:

```bash
python convert_hf_to_gguf.py ../mlx-finetune/fused \
--outfile ../mlx-finetune/mistral-sql.gguf \
--outtype q8_0
```

</details>

### Create Ollama model

```bash
ollama create mistral-sql -f Modelfile
```
