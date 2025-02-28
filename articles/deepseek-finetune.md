# DeepSeek-R1妯″瀷寰皟瀹炴垬锛氬畾鍒朵綘鐨勮涓氫笓灞濧I鍔╂墜

![DeepSeek妯″瀷寰皟](../images/articles/deepseek-finetune.jpg)

> 鎽樿锛氭湰鏂囪缁嗕粙缁嶅浣曞DeepSeek-R1妯″瀷杩涜寰皟锛屼粠鏁版嵁鍑嗗鍒版ā鍨嬮儴缃茬殑鍏ㄦ祦绋嬫寚鍗楋紝甯姪浣犳墦閫犻€傚悎鐗瑰畾琛屼笟鎴栧満鏅殑AI鍔╂墜銆?

**鐩綍**
- [涓轰粈涔堣寰皟DeepSeek妯″瀷](#涓轰粈涔堣寰皟deepseek妯″瀷)
- [寰皟鍓嶇殑鍑嗗宸ヤ綔](#寰皟鍓嶇殑鍑嗗宸ヤ綔)
- [鏁版嵁闆嗗噯澶囦笌澶勭悊](#鏁版嵁闆嗗噯澶囦笌澶勭悊)
- [寰皟杩囩▼璇﹁В](#寰皟杩囩▼璇﹁В)
- [妯″瀷璇勪及涓庝紭鍖朷(#妯″瀷璇勪及涓庝紭鍖?
- [閮ㄧ讲涓庡簲鐢╙(#閮ㄧ讲涓庡簲鐢?
- [甯歌闂涓庤В鍐虫柟妗圿(#甯歌闂涓庤В鍐虫柟妗?
- [鎬荤粨涓庡睍鏈沒(#鎬荤粨涓庡睍鏈?

## 涓轰粈涔堣寰皟DeepSeek妯″瀷

DeepSeek-R1浣滀负涓€娆惧己澶х殑鎺ㄧ悊妯″瀷锛屽凡缁忓湪閫氱敤鍦烘櫙涓嬪睍鐜板嚭鑹茬殑鑳藉姏銆備絾鍦ㄧ壒瀹氳涓氭垨涓撲笟棰嗗煙锛岄€氱敤妯″瀷寰€寰€闅句互婊¤冻涓撲笟闇€姹傘€傚井璋冿紙Fine-tuning锛夊彲浠ヨ妯″瀷瀛︿範鐗瑰畾棰嗗煙鐨勭煡璇嗗拰琛ㄨ揪鏂瑰紡锛屾樉钁楁彁鍗囧湪鍨傜洿鍦烘櫙涓殑琛ㄧ幇銆?

寰皟DeepSeek妯″瀷鐨勪富瑕佷紭鍔垮寘鎷細

1. **涓撲笟棰嗗煙閫傚簲鎬?*锛氳妯″瀷瀛︿範鐗瑰畾琛屼笟鐨勬湳璇€佽鑼冨拰鐭ヨ瘑浣撶郴
2. **涓€鑷存€ф彁鍗?*锛氫娇妯″瀷杈撳嚭绗﹀悎浼佷笟鎴栫粍缁囩殑鏍囧噯鍜岄鏍?
3. **鏁堢巼浼樺寲**锛氬噺灏戞彁绀鸿瘝宸ョ▼鐨勫鏉傚害锛岀敤鏇寸畝鍗曠殑鎸囦护鑾峰緱涓撲笟杈撳嚭
4. **瀹夊叏鎬у寮?*锛氶檷浣庢ā鍨嬪湪鐗瑰畾鍦烘櫙涓嬬殑骞昏鍜岄敊璇巼

## 寰皟鍓嶇殑鍑嗗宸ヤ綔

鍦ㄥ紑濮嬪井璋冧箣鍓嶏紝闇€瑕佸畬鎴愪互涓嬪噯澶囧伐浣滐細

### 1. 鏄庣‘寰皟鐩爣

棣栧厛闇€瑕佹槑纭綘甯屾湜閫氳繃寰皟瑙ｅ喅浠€涔堥棶棰樸€傛槸甯屾湜妯″瀷鎺屾彙鐗瑰畾棰嗗煙鐭ヨ瘑锛熻繕鏄涔犵壒瀹氱殑鍥炵瓟椋庢牸锛熸垨鑰呮槸鎻愬崌鍦ㄦ煇绫讳换鍔′笂鐨勮〃鐜帮紵鏄庣‘鐩爣灏嗙洿鎺ュ奖鍝嶅悗缁殑鏁版嵁鍑嗗鍜岃瘎浼版爣鍑嗐€?

甯歌鐨勫井璋冪洰鏍囧寘鎷細
- 鎺屾彙琛屼笟涓撲笟鐭ヨ瘑锛堝鍖荤枟銆佹硶寰嬨€侀噾铻嶇瓑锛?
- 瀛︿範鐗瑰畾鐨勫洖绛旈鏍硷紙濡傚鏈嶅彛鍚汇€佹暀瀛﹂鏍肩瓑锛?
- 鎻愬崌鐗瑰畾浠诲姟鑳藉姏锛堝鏂囨。鎽樿銆佷唬鐮佺敓鎴愮瓑锛?

### 2. 璇勪及璧勬簮闇€姹?

寰皟澶у瀷璇█妯″瀷闇€瑕佷竴瀹氱殑璁＄畻璧勬簮銆傛牴鎹瓺eepSeek瀹樻柟鏂囨。锛屽井璋僁eepSeek-R1妯″瀷鐨勬渶浣庨厤缃姹傦細

- GPU: 鑷冲皯涓€寮燗100 80GB鎴栧悓绛夋€ц兘鏄惧崱
- RAM: 32GB浠ヤ笂
- 瀛樺偍: 100GB浠ヤ笂SSD绌洪棿

濡傛灉娌℃湁瓒冲鐨勬湰鍦拌祫婧愶紝鍙互鑰冭檻浣跨敤浜戞湇鍔℃彁渚涘晢鐨凣PU瀹炰緥锛屽闃块噷浜戙€佽吘璁簯銆丄WS鎴朑oogle Cloud绛夈€?

### 3. 鐜閰嶇疆

浠ヤ笅鏄厤缃井璋冪幆澧冪殑鍩烘湰姝ラ锛?

```bash
# 鍒涘缓铏氭嫙鐜
conda create -n deepseek-finetune python=3.10
conda activate deepseek-finetune

# 瀹夎蹇呰鐨勪緷璧?
pip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2
pip install transformers==4.33.0 datasets==2.14.5 peft==0.5.0
pip install accelerate==0.23.0 bitsandbytes==0.41.1
pip install deepseek-ai
```

### 4. 鑾峰彇API璁块棶鏉冮檺

濡傛灉浣犺鍒掍娇鐢―eepSeek鎻愪緵鐨凙PI杩涜寰皟锛岄渶瑕佸厛鍦―eepSeek瀹樼綉鐢宠API瀵嗛挜銆傝闂甗DeepSeek寮€鍙戣€呭钩鍙癩(https://platform.deepseek.com/)娉ㄥ唽璐﹀彿骞跺垱寤篈PI瀵嗛挜銆?

## 鏁版嵁闆嗗噯澶囦笌澶勭悊

鏁版嵁闆嗚川閲忔槸寰皟鎴愬姛鐨勫叧閿€備互涓嬫槸鍑嗗楂樿川閲忔暟鎹泦鐨勬楠わ細

### 1. 鏁版嵁鏀堕泦

鏍规嵁寰皟鐩爣锛屾敹闆嗙浉鍏崇殑鏁版嵁銆傛暟鎹潵婧愬彲浠ュ寘鎷細

- 浼佷笟鍐呴儴鐭ヨ瘑搴撳拰鏂囨。
- 琛屼笟涓撲笟鏂囩尞鍜屾暀鏉?
- 涓撳闂瓟璁板綍
- 瀹㈡湇瀵硅瘽璁板綍锛堟敞鎰忛殣绉佷繚鎶わ級
- 鍏紑鐨勪笓涓氭暟鎹泦

### 2. 鏁版嵁鏍煎紡鍖?

DeepSeek妯″瀷寰皟闇€瑕佺壒瀹氭牸寮忕殑鏁版嵁銆傛渶甯哥敤鐨勬牸寮忔槸闂瓟瀵癸紙QA Pairs锛夋垨鎸囦护-鍥炲瀵癸紙Instruction-Response Pairs锛夈€?

鍩烘湰鏍煎紡濡備笅锛?

```json
[
  {
    "instruction": "璇疯В閲婁粈涔堟槸鍖哄潡閾炬妧鏈?,
    "response": "鍖哄潡閾炬槸涓€绉嶅垎甯冨紡鏁版嵁瀛樺偍鎶€鏈紝瀹冮€氳繃鍘讳腑蹇冨寲銆佸姞瀵嗙畻娉曞拰鍏辫瘑鏈哄埗纭繚鏁版嵁鐨勫畨鍏ㄦ€у拰涓嶅彲绡℃敼鎬с€傚叿浣撴潵璇达紝鍖哄潡閾?.."
  },
  {
    "instruction": "鍒嗘瀽2024骞翠腑鍥芥埧鍦颁骇甯傚満瓒嬪娍",
    "response": "2024骞翠腑鍥芥埧鍦颁骇甯傚満鍛堢幇浠ヤ笅瓒嬪娍锛氶鍏堬紝鏀跨瓥闈㈢户缁繚鎸佺ǔ瀹氾紝鍚勫湴鍥犲煄鏂界瓥鏇村姞鐏垫椿锛涘叾娆★紝涓€绾垮煄甯傛埧浠疯秼浜庣ǔ瀹氾紝浜屼笁绾垮煄甯傚垎鍖栨槑鏄撅紱绗笁锛?.."
  }
  // 鏇村鏁版嵁瀵?..
]
```

瀵逛簬鏇村鏉傜殑鍦烘櫙锛屽彲浠ユ坊鍔犻澶栧瓧娈碉紝濡傦細

```json
[
  {
    "instruction": "璇疯В閲婁粈涔堟槸鍖哄潡閾炬妧鏈?,
    "context": "鎴戞槸涓€鍚嶉噾铻嶄笓涓氱殑澶у鐢燂紝瀵瑰姞瀵嗚揣甯佸拰鍖哄潡閾炬妧鏈緢鎰熷叴瓒?,
    "response": "浣滀负閲戣瀺涓撲笟鐨勫鐢燂紝浣犲彲浠ュ皢鍖哄潡閾剧悊瑙ｄ负涓€绉嶉潻鏂版€х殑鍒嗗竷寮忚处鏈妧鏈€備粠閲戣瀺瑙掑害鐪嬶紝鍖哄潡閾炬渶閲嶈鐨勭壒鎬ф槸...",
    "category": "鎶€鏈В閲?
  }
  // 鏇村鏁版嵁瀵?..
]
```

### 3. 鏁版嵁娓呮礂涓庡寮?

楂樿川閲忕殑鏁版嵁闆嗛渶瑕佺粡杩囨竻娲楀拰澧炲己锛?

- **鍘婚噸**锛氬垹闄ら噸澶嶇殑闂瓟瀵?
- **绾犻敊**锛氫慨姝ｈ娉曞拰鎷煎啓閿欒
- **瑙勮寖鍖?*锛氱粺涓€鏍煎紡鍜岄鏍?
- **澧炲己**锛氶€氳繃鍚屼箟鏇挎崲銆侀噸鍐欑瓑鏂瑰紡鎵╁厖鏁版嵁闆?
- **骞宠　**锛氱‘淇濆悇绫讳富棰樻垨浠诲姟绫诲瀷鐨勫潎琛″垎甯?

### 4. 鏁版嵁闆嗗垝鍒?

灏嗗噯澶囧ソ鐨勬暟鎹泦鍒掑垎涓鸿缁冮泦銆侀獙璇侀泦鍜屾祴璇曢泦锛屾瘮渚嬮€氬父涓?:1:1銆?

```python
import json
import random

# 鍔犺浇鏁版嵁
with open('your_dataset.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 闅忔満鎵撲贡
random.shuffle(data)

# 鍒掑垎鏁版嵁闆?
train_size = int(len(data) * 0.8)
val_size = int(len(data) * 0.1)

train_data = data[:train_size]
val_data = data[train_size:train_size+val_size]
test_data = data[train_size+val_size:]

# 淇濆瓨鏁版嵁闆?
with open('train.json', 'w', encoding='utf-8') as f:
    json.dump(train_data, f, ensure_ascii=False, indent=2)

with open('val.json', 'w', encoding='utf-8') as f:
    json.dump(val_data, f, ensure_ascii=False, indent=2)

with open('test.json', 'w', encoding='utf-8') as f:
    json.dump(test_data, f, ensure_ascii=False, indent=2)
```

## 寰皟杩囩▼璇﹁В

DeepSeek妯″瀷寰皟涓昏鏈変袱绉嶆柟寮忥細鍏ㄥ弬鏁板井璋冿紙Full Fine-tuning锛夊拰鍙傛暟楂樻晥寰皟锛圥EFT锛夈€傚浜庡ぇ澶氭暟鍦烘櫙锛屾帹鑽愪娇鐢≒EFT鏂规硶锛岀壒鍒槸LoRA锛圠ow-Rank Adaptation锛夋妧鏈紝瀹冭兘鍦ㄦ樉钁楅檷浣庤绠楄祫婧愰渶姹傜殑鍚屾椂淇濇寔鑹ソ鐨勬晥鏋溿€?

### 1. 浣跨敤LoRA杩涜寰皟

浠ヤ笅鏄娇鐢℉ugging Face Transformers鍜孭EFT搴撹繘琛孡oRA寰皟鐨勭ず渚嬩唬鐮侊細

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
from trl import SFTTrainer

# 鍔犺浇妯″瀷鍜屽垎璇嶅櫒
model_name = "deepseek-ai/deepseek-r1-chat-7b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

# 鍔犺浇妯″瀷锛堜娇鐢?bit閲忓寲鍑忓皯鍐呭瓨鍗犵敤锛?
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,
    load_in_8bit=True,
    device_map="auto"
)

# 鍑嗗妯″瀷杩涜8bit璁粌
model = prepare_model_for_kbit_training(model)

# 閰嶇疆LoRA
lora_config = LoraConfig(
    r=16,                    # LoRA鐭╅樀鐨勭З
    lora_alpha=32,           # LoRA鐨刟lpha鍙傛暟
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],  # 瑕佸井璋冪殑妯″潡
    lora_dropout=0.05,       # Dropout姒傜巼
    bias="none",             # 鏄惁寰皟鍋忕疆鍙傛暟
    task_type="CAUSAL_LM"    # 浠诲姟绫诲瀷
)

# 搴旂敤LoRA閰嶇疆
model = get_peft_model(model, lora_config)

# 鍔犺浇鏁版嵁闆?
dataset = load_dataset("json", data_files={"train": "train.json", "validation": "val.json"})

# 瀹氫箟璁粌鍙傛暟
training_args = TrainingArguments(
    output_dir="./deepseek-r1-finetuned",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    save_steps=100,
    logging_steps=10,
    learning_rate=2e-4,
    weight_decay=0.01,
    fp16=True,
    warmup_steps=100,
    evaluation_strategy="steps",
    eval_steps=100,
    save_total_limit=3,
    load_best_model_at_end=True,
)

# 瀹氫箟璁粌鍣?
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["validation"],
    tokenizer=tokenizer,
    peft_config=lora_config,
    dataset_text_field="text",
    max_seq_length=2048
)

# 寮€濮嬭缁?
trainer.train()

# 淇濆瓨妯″瀷
trainer.save_model("./deepseek-r1-finetuned-final")
```

### 2. 寰皟瓒呭弬鏁拌皟鏁?

寰皟杩囩▼涓紝浠ヤ笅瓒呭弬鏁板缁撴灉褰卞搷杈冨ぇ锛?

- **瀛︿範鐜?*锛坙earning_rate锛夛細閫氬父鍦?e-5鍒?e-4涔嬮棿锛屽浜嶭oRA鍙互绋嶉珮
- **鎵规澶у皬**锛坆atch_size锛夛細鏍规嵁GPU鍐呭瓨璋冩暣锛岄€氬父4-16
- **璁粌杞**锛坣um_train_epochs锛夛細閫氬父2-5杞紝瑙嗘暟鎹泦澶у皬鑰屽畾
- **LoRA绉?*锛坮锛夛細閫氬父8-32锛岃秺澶ф晥鏋滆秺濂戒絾闇€瑕佹洿澶氳祫婧?
- **LoRA Alpha**锛坙ora_alpha锛夛細閫氬父璁句负r鐨?鍊?

## 妯″瀷璇勪及涓庝紭鍖?

寰皟瀹屾垚鍚庯紝闇€瑕佸妯″瀷杩涜鍏ㄩ潰璇勪及锛岀‘淇濆畠鍦ㄧ洰鏍囦换鍔′笂琛ㄧ幇鑹ソ銆?

### 1. 瀹氶噺璇勪及

鏍规嵁浠诲姟绫诲瀷锛屽彲浠ヤ娇鐢ㄤ笉鍚岀殑璇勪及鎸囨爣锛?

- 瀵逛簬鐢熸垚浠诲姟锛欱LEU銆丷OUGE銆丮ETEOR绛?
- 瀵逛簬鍒嗙被浠诲姟锛氬噯纭巼銆佺簿纭巼銆佸彫鍥炵巼銆丗1鍒嗘暟绛?
- 瀵逛簬闂瓟浠诲姟锛氬噯纭巼銆佺浉鍏虫€х瓑

浠ヤ笅鏄娇鐢≧OUGE璇勪及妯″瀷鐢熸垚璐ㄩ噺鐨勭ず渚嬩唬鐮侊細

```python
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from rouge_score import rouge_scorer

# 鍔犺浇寰皟鍚庣殑妯″瀷
model_path = "./deepseek-r1-finetuned-final"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    torch_dtype=torch.float16,
    device_map="auto"
)

# 鍔犺浇娴嬭瘯鏁版嵁
test_data = load_dataset("json", data_files="test.json")["train"]

# 鍒濆鍖朢OUGE璇勫垎鍣?
scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)

# 璇勪及鍑芥暟
def evaluate_model(model, tokenizer, test_data):
    rouge1_scores = []
    rouge2_scores = []
    rougeL_scores = []
    
    for item in test_data:
        instruction = item["instruction"]
        reference = item["response"]
        
        # 鐢熸垚鍥炵瓟
        inputs = tokenizer(instruction, return_tensors="pt").to(model.device)
        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                max_new_tokens=512,
                temperature=0.7,
                top_p=0.9,
                do_sample=True
            )
        
        prediction = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # 璁＄畻ROUGE鍒嗘暟
        scores = scorer.score(reference, prediction)
        rouge1_scores.append(scores['rouge1'].fmeasure)
        rouge2_scores.append(scores['rouge2'].fmeasure)
        rougeL_scores.append(scores['rougeL'].fmeasure)
    
    # 璁＄畻骞冲潎鍒嗘暟
    avg_rouge1 = sum(rouge1_scores) / len(rouge1_scores)
    avg_rouge2 = sum(rouge2_scores) / len(rouge2_scores)
    avg_rougeL = sum(rougeL_scores) / len(rougeL_scores)
    
    return {
        "rouge1": avg_rouge1,
        "rouge2": avg_rouge2,
        "rougeL": avg_rougeL
    }

# 鎵ц璇勪及
results = evaluate_model(model, tokenizer, test_data)
print(f"璇勪及缁撴灉: {results}")
```

### 2. 瀹氭€ц瘎浼?

闄や簡瀹氶噺鎸囨爣锛岃繕搴旇繘琛屽畾鎬ц瘎浼帮細

- **浜哄伐瀹℃牳**锛氫笓瀹跺鏍告ā鍨嬪洖绛旂殑鍑嗙‘鎬у拰鐩稿叧鎬?
- **A/B娴嬭瘯**锛氭瘮杈冨井璋冨墠鍚庣殑妯″瀷琛ㄧ幇
- **鐢ㄦ埛鍙嶉**锛氭敹闆嗗疄闄呯敤鎴风殑浣跨敤鍙嶉

### 3. 妯″瀷浼樺寲

鏍规嵁璇勪及缁撴灉锛屽彲浠ラ噰鍙栦互涓嬩紭鍖栨帾鏂斤細

- **鏁版嵁澧炲己**锛氬鍔犳洿澶氶珮璐ㄩ噺鐨勮缁冩暟鎹?
- **瓒呭弬鏁拌皟鏁?*锛氳皟鏁村涔犵巼銆佹壒娆″ぇ灏忕瓑鍙傛暟
- **娣峰悎寰皟**锛氱粨鍚堜笉鍚岀被鍨嬬殑浠诲姟鏁版嵁
- **杩唬寰皟**锛氬熀浜庡弽棣堣繘琛屽杞井璋?

## 閮ㄧ讲涓庡簲鐢?

寰皟瀹屾垚骞惰瘎浼版弧鎰忓悗锛屽彲浠ュ皢妯″瀷閮ㄧ讲鍒扮敓浜х幆澧冧腑銆?

### 1. 妯″瀷杞崲涓庝紭鍖?

閮ㄧ讲鍓嶏紝鍙互瀵规ā鍨嬭繘琛岃繘涓€姝ヤ紭鍖栵細

- **閲忓寲**锛氬皢妯″瀷浠嶧P16/FP32杞崲涓篒NT8鎴朓NT4锛屽噺灏戝唴瀛樺崰鐢?
- **鍓灊**锛氱Щ闄や笉蹇呰鐨勫弬鏁帮紝鍑忓皬妯″瀷澶у皬
- **鐭ヨ瘑钂搁**锛氬皢澶фā鍨嬬煡璇嗚捀棣忓埌鏇村皬鐨勬ā鍨嬩腑

```python
# 妯″瀷閲忓寲绀轰緥
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# 鍔犺浇寰皟鍚庣殑妯″瀷
model_path = "./deepseek-r1-finetuned-final"
tokenizer = AutoTokenizer.from_pretrained(model_path)

# 鍔犺浇涓?浣嶆暣鏁伴噺鍖栨ā鍨?
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    load_in_8bit=True,
    device_map="auto"
)

# 淇濆瓨閲忓寲妯″瀷
model.save_pretrained("./deepseek-r1-finetuned-8bit")
tokenizer.save_pretrained("./deepseek-r1-finetuned-8bit")
```

### 2. 閮ㄧ讲閫夐」

鏍规嵁闇€姹傚拰璧勬簮锛屽彲浠ラ€夋嫨涓嶅悓鐨勯儴缃叉柟寮忥細

- **鏈湴閮ㄧ讲**锛氶€傚悎鍐呴儴浣跨敤锛岃祫婧愯姹傞珮
- **浜戞湇鍔￠儴缃?*锛氫娇鐢ˋWS銆侀樋閲屼簯绛夋彁渚涚殑GPU瀹炰緥
- **涓撶敤鏈嶅姟**锛氫娇鐢―eepSeek鎻愪緵鐨勬墭绠℃湇鍔?
- **杈圭紭閮ㄧ讲**锛氬湪璧勬簮鍙楅檺璁惧涓婇儴缃查噺鍖栫増妯″瀷

### 3. API鏈嶅姟鏋勫缓

浣跨敤FastAPI鏋勫缓妯″瀷鏈嶅姟API鐨勭ず渚嬶細

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI(title="DeepSeek寰皟妯″瀷API")

# 鍔犺浇妯″瀷鍜屽垎璇嶅櫒
model_path = "./deepseek-r1-finetuned-8bit"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForCausalLM.from_pretrained(
    model_path,
    device_map="auto"
)

class QueryRequest(BaseModel):
    query: str
    max_length: int = 512
    temperature: float = 0.7
    top_p: float = 0.9

class QueryResponse(BaseModel):
    response: str

@app.post("/generate", response_model=QueryResponse)
async def generate(request: QueryRequest):
    try:
        inputs = tokenizer(request.query, return_tensors="pt").to(model.device)
        
        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                max_new_tokens=request.max_length,
                temperature=request.temperature,
                top_p=request.top_p,
                do_sample=True
            )
        
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return {"response": response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 4. 鐩戞帶涓庣淮鎶?

閮ㄧ讲鍚庯紝闇€瑕佹寔缁洃鎺фā鍨嬫€ц兘骞惰繘琛岀淮鎶わ細

- **鎬ц兘鐩戞帶**锛氳窡韪搷搴旀椂闂淬€佸悶鍚愰噺绛夋寚鏍?
- **璐ㄩ噺鐩戞帶**锛氭娊鏍锋鏌ユā鍨嬪洖绛旇川閲?
- **鐢ㄦ埛鍙嶉**锛氭敹闆嗗苟鍒嗘瀽鐢ㄦ埛鍙嶉
- **瀹氭湡鏇存柊**锛氭牴鎹柊鏁版嵁鍜屽弽棣堝畾鏈熸洿鏂版ā鍨?

## 甯歌闂涓庤В鍐虫柟妗?

### 1. 杩囨嫙鍚堥棶棰?

**鐥囩姸**锛氭ā鍨嬪湪璁粌闆嗕笂琛ㄧ幇鏋佷匠锛屼絾鍦ㄩ獙璇侀泦鍜屾祴璇曢泦涓婅〃鐜板樊銆?

**瑙ｅ喅鏂规**锛?
- 澧炲姞璁粌鏁版嵁澶氭牱鎬?
- 娣诲姞姝ｅ垯鍖栵紙濡傛潈閲嶈“鍑忥級
- 鍑忓皯璁粌杞
- 浣跨敤鏃╁仠锛圗arly Stopping锛?

### 2. 鐏鹃毦鎬ч仐蹇?

**鐥囩姸**锛氬井璋冨悗鐨勬ā鍨嬩涪澶变簡鍘熸湁鐨勯€氱敤鑳藉姏銆?

**瑙ｅ喅鏂规**锛?
- 浣跨敤娣峰悎鏁版嵁闆嗭紝鍖呭惈涓€瀹氭瘮渚嬬殑閫氱敤浠诲姟鏁版嵁
- 闄嶄綆瀛︿範鐜?
- 浣跨敤寮规€ф潈閲嶅悎骞讹紙EWC锛夌瓑鎶€鏈?

### 3. 璧勬簮涓嶈冻

**鐥囩姸**锛氳缁冭繃绋嬩腑鍑虹幇OOM锛堝唴瀛樹笉瓒筹級閿欒銆?

**瑙ｅ喅鏂规**锛?
- 鍑忓皬鎵规澶у皬
- 浣跨敤姊害绱Н
- 浣跨敤鏇撮珮鏁堢殑寰皟鏂规硶锛堝LoRA銆丵LoRA锛?
- 浣跨敤妯″瀷骞惰鎴栨祦姘寸嚎骞惰

### 4. 鐢熸垚璐ㄩ噺涓嶄匠

**鐥囩姸**锛氭ā鍨嬬敓鎴愮殑鍐呭璐ㄩ噺涓嶉珮锛屽瓨鍦ㄩ噸澶嶃€佷笉杩炶疮绛夐棶棰樸€?

**瑙ｅ喅鏂规**锛?
- 浼樺寲璁粌鏁版嵁璐ㄩ噺
- 璋冩暣瑙ｇ爜鍙傛暟锛堟俯搴︺€乼op_p绛夛級
- 灏濊瘯涓嶅悓鐨勫井璋冪瓥鐣?
- 澧炲姞鐗瑰畾浠诲姟鐨勭ず渚嬫暟鎹?

## 鎬荤粨涓庡睍鏈?

閫氳繃鏈枃鐨勮缁嗘寚鍗楋紝浣犲簲璇ュ凡缁忔帉鎻′簡DeepSeek-R1妯″瀷寰皟鐨勫畬鏁存祦绋嬶紝浠庢暟鎹噯澶囧埌妯″瀷閮ㄧ讲鐨勫悇涓幆鑺傘€傚井璋冭嚜宸辩殑DeepSeek妯″瀷涓嶄粎鍙互鎻愬崌鐗瑰畾棰嗗煙鐨勮〃鐜帮紝杩樿兘涓轰紒涓氭垨缁勭粐鍒涢€犵嫭鐗圭殑AI鑳藉姏銆?

闅忕潃澶ц瑷€妯″瀷鎶€鏈殑涓嶆柇鍙戝睍锛屽井璋冩妧鏈篃鍦ㄦ寔缁紨杩涖€傛湭鏉ワ紝鎴戜滑鍙互鏈熷緟锛?

1. **鏇撮珮鏁堢殑寰皟鏂规硶**锛氶渶瑕佹洿灏戠殑璁＄畻璧勬簮鍜岃缁冩暟鎹?
2. **鏇寸簿缁嗙殑鑳藉姏璋冩暣**锛氬彲浠ラ拡瀵规ā鍨嬬殑鐗瑰畾鑳藉姏杩涜瀹氬悜澧炲己
3. **鏇寸畝渚跨殑宸ュ叿閾?*锛氶檷浣庡井璋冪殑鎶€鏈棬妲涳紝浣挎洿澶氫汉鑳藉瀹氬埗鑷繁鐨凙I妯″瀷

鏃犺浣犳槸甯屾湜涓虹壒瀹氳涓氭墦閫犱笓灞濧I鍔╂墜锛岃繕鏄负浼佷笟鏋勫缓鐭ヨ瘑鍨嬮棶绛旂郴缁燂紝寰皟DeepSeek妯″瀷閮芥槸涓€涓己澶ц€屽疄鐢ㄧ殑瑙ｅ喅鏂规銆?

**寤朵几闃呰锛?*
- [DeepSeek鏂版墜蹇呯湅锛氫粠娉ㄥ唽鍒癆PI璋冪敤鐨勫畬鏁存寚鍗梋(./deepseek-guide.md)
- [鐖嗚倽50灏忔椂锛孌eepSeek浣跨敤鎶€宸э紝浣犳敹钘忚繖涓€绡囧氨澶熶簡锛乚(./deepseek-tips.md)
- [DeepSeek楂橀樁鐢ㄦ硶锛氬浣曠敤MoE鏋舵瀯浼樺寲浼佷笟绾I搴旂敤锛焆(./deepseek-advanced.md)

---

*鏈€鍚庢洿鏂? 2024骞?鏈?5鏃? 
