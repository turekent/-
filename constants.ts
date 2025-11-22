
import { PresetItem } from "./types";

// Using Pollinations.ai for consistent, representative thumbnails based on descriptions
// Descriptions are refined to be high-quality prompts for the AI generation.

export const HAIR_PRESETS: PresetItem[] = [
  // Female Hair
  { 
    id: 'fh1', 
    name: '波浪长卷发', 
    category: 'hair', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20beautiful%20woman%20with%20long%20dark%20wavy%20hair%20elegant%20style%20front%20view%20white%20background%20photorealistic?width=400&height=500&nologo=true&seed=101', 
    description: '完全替换当前发型。改为一头深棕色的优雅长波浪卷发，发卷从耳侧开始自然下垂，S型弧度清晰，发质柔顺有光泽，充满成熟女性魅力。' 
  },
  { 
    id: 'fh2', 
    name: '日系粉色直发', 
    category: 'hair', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20asian%20woman%20with%20long%20straight%20sakura%20pink%20hair%20air%20bangs%20anime%20style%20white%20background?width=400&height=500&nologo=true&seed=102', 
    description: '完全替换当前发型。改为二次元风格的樱花粉色长直发，带有轻盈的空气刘海，发尾整齐垂直，色调柔和梦幻，发丝顺滑。' 
  },
  { 
    id: 'fh3', 
    name: '复古大波浪', 
    category: 'hair', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20vintage%20hollywood%20glamour%20black%20deep%20wavy%20hair%20side%20part%20white%20background?width=400&height=500&nologo=true&seed=103', 
    description: '完全替换当前发型。改为好莱坞黄金时代的复古侧分大波浪，黑发色泽油亮，S型刘海完美修饰脸型，发卷丰盈有弹性。' 
  },
  { 
    id: 'fh4', 
    name: '韩式锁骨发', 
    category: 'hair', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20korean%20woman%20medium%20length%20brown%20hair%20collarbone%20length%20soft%20layers%20white%20background?width=400&height=500&nologo=true&seed=104', 
    description: '完全替换当前发型。改为长度刚好及锁骨的深栗色中长发，发尾微微内扣，脸颊两侧层次丰富，八字刘海修饰下颌线条。' 
  },
  { 
    id: 'fh5', 
    name: '法式慵懒卷', 
    category: 'hair', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20french%20woman%20short%20messy%20wavy%20bob%20hair%20brown%20chic%20white%20background?width=400&height=500&nologo=true&seed=105', 
    description: '完全替换当前发型。改为法式慵懒风微卷短发（French Bob），长度及下巴，带有自然的凌乱感和微卷纹理，棕色系。' 
  },
  { 
    id: 'fh6', 
    name: '高马尾扎发', 
    category: 'hair', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20side%20profile%20woman%20high%20sleek%20ponytail%20hairstyle%20sporty%20white%20background?width=400&height=500&nologo=true&seed=106', 
    description: '完全替换当前发型。改为利落紧致的高马尾扎发，完全露出光洁的额头和颈部线条，发尾顺滑直垂，移除原有披肩发。' 
  },
  
  // Male Hair
  { 
    id: 'mh1', 
    name: '清爽寸头', 
    category: 'hair', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20handsome%20man%20very%20short%20buzz%20cut%20hairstyle%20masculine%20white%20background?width=400&height=500&nologo=true&seed=201', 
    description: '完全替换当前发型。改为极短的圆寸发型，轮廓清晰，贴合头皮，展现完美的头型，最大程度凸显五官的立体感。' 
  },
  { 
    id: 'mh2', 
    name: '韩式微分碎盖', 
    category: 'hair', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20korean%20man%20hairstyle%20textured%20fringe%20two%20block%20cut%20dark%20hair%20white%20background?width=400&height=500&nologo=true&seed=202', 
    description: '完全替换当前发型。改为韩式风格的微分碎盖头，前额刘海打碎并微微分开，头顶头发蓬松且纹理清晰，两侧鬓角收紧。' 
  },
  { 
    id: 'mh3', 
    name: '美式复古油头', 
    category: 'hair', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20gentleman%20classic%20pompadour%20undercut%20hairstyle%20slicked%20back%20white%20background?width=400&height=500&nologo=true&seed=203', 
    description: '完全替换当前发型。改为经典的美式侧分背头（Undercut），两侧铲青修短，头顶头发留长并使用发油向后梳理定型。' 
  },
  { 
    id: 'mh4', 
    name: '日系微卷中分', 
    category: 'hair', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/close%20up%20portrait%20japanese%20man%20medium%20length%20wavy%20center%20part%20hair%20artistic%20white%20background?width=400&height=500&nologo=true&seed=204', 
    description: '完全替换当前发型。改为带有艺术气息的日系中分发型，头发微长且带有不规则的微卷烫发，刘海呈八字形修饰脸型。' 
  },
];

export const CLOTHES_PRESETS: PresetItem[] = [
  // Female Clothing
  { 
    id: 'fc1', 
    name: '清新碎花裙', 
    category: 'clothing', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/woman%20wearing%20cute%20yellow%20floral%20summer%20dress%20tiny%20flowers%20puff%20sleeves%20white%20background?width=400&height=500&nologo=true&seed=301', 
    description: '一件淡黄色的法式V领碎花连衣长裙，布满细小的白色花朵印花，泡泡袖设计，收腰剪裁，材质轻盈飘逸，充满夏日田园清新气息。' 
  },
  { 
    id: 'fc2', 
    name: '红色丝绒礼服', 
    category: 'clothing', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/woman%20wearing%20luxurious%20deep%20red%20velvet%20evening%20gown%20off%20shoulder%20white%20background?width=400&height=500&nologo=true&seed=302', 
    description: '一件高贵的酒红色丝绒晚礼服，抹胸露肩设计，修身鱼尾裙摆，面料在光线下泛着细腻的高级光泽，尽显优雅奢华。' 
  },
  { 
    id: 'fc3', 
    name: '白色波西米亚裙', 
    category: 'clothing', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/woman%20wearing%20white%20boho%20lace%20maxi%20dress%20flowy%20embroidery%20white%20background?width=400&height=500&nologo=true&seed=303', 
    description: '一件纯白色的波西米亚风格棉麻长裙，带有复杂的蕾丝镂空和流苏细节，版型宽松飘逸，大裙摆，充满自由浪漫的度假风情。' 
  },
  { 
    id: 'fc4', 
    name: '学院风针织穿搭', 
    category: 'clothing', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/girl%20wearing%20beige%20knit%20vest%20over%20white%20shirt%20plaid%20skirt%20preppy%20style%20white%20background?width=400&height=500&nologo=true&seed=304', 
    description: '米色菱格纹V领针织背心，内搭挺括的白色翻领衬衫，下身搭配深色百褶格纹短裙，典型的JK学院风穿搭，青春活力。' 
  },
  { 
    id: 'fc5', 
    name: '中式旗袍', 
    category: 'clothing', 
    gender: 'female', 
    imageUrl: 'https://image.pollinations.ai/prompt/woman%20wearing%20blue%20and%20white%20porcelain%20qipao%20chinese%20dress%20slim%20white%20background?width=400&height=500&nologo=true&seed=305', 
    description: '一件改良版青花瓷配色旗袍，精致的立领盘扣，修身剪裁，高开叉设计，绸缎面料，完美勾勒东方女性的曼妙身姿。' 
  },

  // Male Clothing
  { 
    id: 'mc1', 
    name: '深蓝商务西装', 
    category: 'clothing', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/man%20wearing%20fitted%20navy%20blue%20business%20suit%20white%20shirt%20tie%20professional%20white%20background?width=400&height=500&nologo=true&seed=401', 
    description: '一套剪裁合体的深海军蓝商务西装，平驳领设计，搭配挺括的白色衬衫和深色丝质领带，展现专业干练的商务精英形象。' 
  },
  { 
    id: 'mc2', 
    name: '灰色街头卫衣', 
    category: 'clothing', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/man%20wearing%20heather%20grey%20oversized%20hoodie%20streetwear%20style%20white%20background?width=400&height=500&nologo=true&seed=402', 
    description: '一件浅灰色重磅纯棉连帽卫衣，落肩Oversize宽松版型，胸前带有极简的黑色字母印花，风格随性慵懒，适合街头休闲。' 
  },
  { 
    id: 'mc3', 
    name: '经典牛仔外套', 
    category: 'clothing', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/man%20wearing%20classic%20blue%20denim%20jacket%20white%20t-shirt%20white%20background?width=400&height=500&nologo=true&seed=403', 
    description: '一件复古水洗做旧蓝牛仔外套，硬挺丹宁面料，金属纽扣，内搭白色圆领T恤，展现粗犷帅气的工装休闲风格。' 
  },
  { 
    id: 'mc4', 
    name: '黑色皮衣夹克', 
    category: 'clothing', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/man%20wearing%20black%20leather%20biker%20jacket%20zippers%20cool%20white%20background?width=400&height=500&nologo=true&seed=404', 
    description: '一件经典的机车风格黑色真皮夹克，斜拉链设计，带有金属铆钉装饰，皮革光泽质感强，翻领设计，酷劲十足。' 
  },
  { 
    id: 'mc5', 
    name: '卡其色风衣', 
    category: 'clothing', 
    gender: 'male', 
    imageUrl: 'https://image.pollinations.ai/prompt/man%20wearing%20beige%20trench%20coat%20double%20breasted%20classy%20white%20background?width=400&height=500&nologo=true&seed=405', 
    description: '一件经典的英伦风双排扣卡其色长款风衣，带有肩章和腰带系结，版型挺括，内搭衬衫，展现绅士儒雅的成熟气质。' 
  },
];
