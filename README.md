# mlx-fine-tune

Train:

```bash
mlx_lm.lora --train \
--model /Users/colinlienard/.cache/huggingface/hub/models--mistralai--Mistral-7B-Instruct-v0.3/ \
--data data \
--batch-size 3
```

Create Ollama model:

```bash
ollama create yes -f Modelfile -q q4_0
```
