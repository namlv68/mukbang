import React, { useState, useEffect } from 'react';
import { Camera, Users, Utensils, Zap, Copy, Check, Globe, Clock, Flame, ChevronUp, ChevronDown, MonitorPlay, Droplets, Wind, Star, Search, PlusCircle, Coffee, EyeOff, Shirt, Sparkles, Link, ShoppingBag, Key } from 'lucide-react';
import { executeAiWithFallback } from './aiService';

const loadSavedState = () => {
  try {
    const saved = localStorage.getItem('mukbangAppState');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Lỗi parse saved state:", e);
  }
  return {};
};

const App = () => {
  const savedState = loadSavedState();
  const [numCharacters, setNumCharacters] = useState<number>(savedState.numCharacters ?? 1);
  const [outfitMode, setOutfitMode] = useState<string>(savedState.outfitMode ?? 'Cameo'); // 'Cameo' or 'Random'
  const [settingMode, setSettingMode] = useState<string>(savedState.settingMode ?? 'Cameo'); // 'Cameo' or 'Theme'
  const charNamesList = ["NAM", "NGỌC", "THƯ"];
  const [theme, setTheme] = useState<string>(savedState.theme ?? 'GiantSeafood');
  const [customFood, setCustomFood] = useState<string>(savedState.customFood ?? '');
  const [duration, setDuration] = useState<number>(savedState.duration ?? 12);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<{ vi: string, en: string, zh: string }[] | null>(savedState.generatedPrompts ?? null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCommerceMode, setIsCommerceMode] = useState<boolean>(savedState.isCommerceMode ?? false);
  const [productName, setProductName] = useState<string>(savedState.productName ?? '');
  const [cameraStyle, setCameraStyle] = useState<string>(savedState.cameraStyle ?? 'Macro');
  const [eatingStyle, setEatingStyle] = useState<string>(savedState.eatingStyle ?? 'Steady');

  useEffect(() => {
    const stateObj = {
      numCharacters, outfitMode, settingMode, theme, customFood, duration, isCommerceMode, productName, cameraStyle, eatingStyle, generatedPrompts
    };
    localStorage.setItem('mukbangAppState', JSON.stringify(stateObj));
  }, [numCharacters, outfitMode, settingMode, theme, customFood, duration, isCommerceMode, productName, cameraStyle, eatingStyle, generatedPrompts]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setGeneratedPrompts(null);
    setNumCharacters(1);
    setOutfitMode('Cameo');
    setSettingMode('Cameo');
    setCustomFood('');
    setDuration(12);
    setIsCommerceMode(false);
    setProductName('');
    setCameraStyle('Macro');
    setEatingStyle('Steady');
  };

  // API Key State
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(true);
  const [tempApiKeysInput, setTempApiKeysInput] = useState<string>('');
  const [activeApiKeyIndex, setActiveApiKeyIndex] = useState<number>(0);

  useEffect(() => {
    const storedKeys = localStorage.getItem('geminiApiKeys');
    if (storedKeys) {
      try {
        const parsed = JSON.parse(storedKeys);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setApiKeys(parsed);
          setTempApiKeysInput(parsed.join('\n'));
          setShowApiKeyModal(false);
        }
      } catch (e) {
        console.error("Lỗi parse API Keys:", e);
      }
    }
  }, []);

  const handleSaveApiKeys = () => {
    const keys = tempApiKeysInput.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    if (keys.length > 0) {
      setApiKeys(keys);
      localStorage.setItem('geminiApiKeys', JSON.stringify(keys));
      setShowApiKeyModal(false);
      setActiveApiKeyIndex(0);
    } else {
      alert("Vui lòng nhập ít nhất 1 API key.");
    }
  };

  const themes = [
    { id: 'Random', name: 'Ngẫu nhiên (AI chọn)', icon: '🎲' },
    { id: 'GiantSeafood', name: 'Hải Sản Khổng Lồ', icon: '🦀' },
    { id: 'ShellfishWorld', name: 'Thế Giới Các Món Ốc', icon: '🐚' },
    { id: 'LobsterFeast', name: 'Tôm Hùm Sốt Bơ Tỏi', icon: '🦞' },
    { id: 'SpicyMixed', name: 'Combo Đồ Cay', icon: '🔥' },
    { id: 'FriedCrispy', name: 'Combo Đồ Chiên Rán', icon: '🍗' },
    { id: 'SpicyNoodles', name: 'Mì Cay 7 Cấp Độ', icon: '🌶️' },
    { id: 'SushiSashimi', name: 'Sushi & Sashimi', icon: '🍣' },
    { id: 'BoiledMixed', name: 'Combo Đồ Luộc & Healthy', icon: '🥬' },
    { id: 'RawSpicy', name: 'Cua Ngâm Tương & Tôm Sống', icon: '🦐' },
    { id: 'SweetCombo', name: 'Combo Đồ Ngọt & Bánh', icon: '🍰' },
    { id: 'BunDauMamTom', name: 'Bún Đậu Mắm Tôm', icon: '🥢' },
    { id: 'GiantPho', name: 'Phở Bò Khổng Lồ', icon: '🍜' },
    { id: 'BanhMiChao', name: 'Bánh Mì Chảo Đầy Ú Nụ', icon: '🍳' },
    { id: 'TomYumHotpot', name: 'Lẩu Thái Tom Yum', icon: '🍲' },
    { id: 'ComTam', name: 'Cơm Tấm Sườn Bì', icon: '🍛' },
    { id: 'BunBoHue', name: 'Bún Bò Huế Đậm Vị', icon: '🥣' },
    { id: 'GrilledLambLeg', name: 'Đùi Cừu Nướng Mật', icon: '🍖' },
    { id: 'ClayBakedChicken', name: 'Gà Nướng Đất Sét', icon: '🍗' },
    { id: 'GiantBurger', name: 'Burger Khổng Lồ', icon: '🍔' },
    { id: 'SeafoodPizza', name: 'Pizza Phô Mai', icon: '🍕' },
    { id: 'WagyuSteak', name: 'Bít Tết Bò Wagyu', icon: '🥩' },
    { id: 'BBQRibs', name: 'Sườn Nướng BBQ', icon: '🍖' },
    { id: 'KoreanAssorted', name: 'Mẹt Đồ Hàn', icon: '🍙' },
    { id: 'WesternFruit', name: 'Trái Cây Cốt Dừa', icon: '🥥' },
    { id: 'GiantCandy', name: 'Khay Kẹo Khổng Lồ', icon: '🍬' },
    { id: 'NhaTrangSkewers', name: 'Nem Nướng Nha Trang', icon: '🍢' },
    { id: 'GiantBanhXeo', name: 'Bánh Xèo Khổng Lồ', icon: '🌮' },
    { id: 'PekingDuck', name: 'Vịt Quay Bắc Kinh', icon: '🦆' },
    { id: 'Vegetarian', name: 'Mâm Đồ Chay', icon: '🥦' },
    { id: 'GiantSquid', name: 'Mực Khổng Lồ Nướng', icon: '🦑' },
    { id: 'JamonHam', name: 'Đùi Lợn Muối', icon: '🐖' },
    { id: 'SausageTray', name: 'Xúc Xích Phô Mai', icon: '🌭' },
    { id: 'SpringRolls', name: 'Gỏi Cuốn Tôm Thịt', icon: '🌯' },
    { id: 'SweetSoup', name: 'Combo Chè Hẻm', icon: '🍧' },
    { id: 'GrilledSnakehead', name: 'Cá Lóc Nướng Trui', icon: '🐟' },
    { id: 'SpaghettiCheese', name: 'Mì Ý Sốt Bò Băm', icon: '🍝' },
    { id: 'DurianFruit', name: 'Sầu Riêng Chín Cây', icon: '🍈' },
    { id: 'IceCreamTray', name: 'Kem Khay Bốc Khói', icon: '🍦' },
    { id: 'GiantBibimbap', name: 'Cơm Trộn Hàn Quốc', icon: '🍳' },
    { id: 'HotTakoyaki', name: 'Khay Takoyaki', icon: '🐙' },
    { id: 'Custom', name: 'Món ăn tùy chọn', icon: '✍️' }
  ];

  const cameraStyles = [
    { id: 'Macro', name: 'Cận cảnh (Macro)', icon: '🔍', descriptions: { vi: 'Macro/Close-up, tập trung vào chi tiết và bề mặt đồ ăn.', en: 'Macro/Close-up, focusing on food details and textures.', zh: '微距/特写，聚焦食物细节和纹理。' } },
    { id: 'Fixed', name: 'Góc máy cố định', icon: '🎥', descriptions: { vi: 'Góc máy cố định (Fixed), khung hình trung bình, ổn định.', en: 'Fixed camera angle, medium shot, stable and consistent.', zh: '固定摄影机角度，中景，稳定且一致。' } },
    { id: 'ZoomIn', name: 'Zoom gần đồ ăn', icon: '🔎', descriptions: { vi: 'Slow Zoom mượt mà vào món ăn đang được nhân vật ăn.', en: 'Smooth slow zoom into the food being eaten by the characters.', zh: '平滑地慢速放大角色正在吃的食物。' } },
    { id: 'TopDown', name: 'Góc quay từ trên xuống', icon: '📐', descriptions: { vi: 'Top-down shot, bao quát toàn bộ mâm thức ăn từ trên cao.', en: 'Top-down shot, overlooking the entire food tray from above.', zh: '俯拍镜头，从上方俯瞰整个食物托盘。' } },
    { id: 'Dynamic', name: 'Linh hoạt (Pan/Tilt)', icon: '🔄', descriptions: { vi: 'Chuyển động linh hoạt (Dynamic), lia máy mượt mà xung quanh đồ ăn.', en: 'Dynamic movement, smooth pan/tilt around the food.', zh: '动态运动，在食物周围平稳平移/倾斜。' } },
  ];

  const eatingStyles = [
    { id: 'Steady', name: 'Bình tĩnh', icon: '🧘', descriptions: { vi: 'Ăn từ tốn, bình tĩnh, thưởng thức kỹ từng miếng.', en: 'Eating calmly, steady, enjoying every bite thoroughly.', zh: '从容地吃，稳重，仔细享受每一口。' } },
    { id: 'Hectic', name: 'Dồn dập', icon: '⚡', descriptions: { vi: 'Ăn nhanh, dồn dập, cắn miếng lớn liên tục, nhai vội vã.', en: 'Eating fast, hectic, taking large continuous bites, chewing rapidly.', zh: '快节奏，忙碌地大口吃，快速咀嚼。' } },
    { id: 'Elegant', name: 'Lịch thiệp', icon: '✨', descriptions: { vi: 'Ăn nhẹ nhàng, phong thái sang trọng, cử chỉ lịch sự.', en: 'Eating gently, elegant posture, polite gestures.', zh: '斯文地吃，风格优雅，举止得体。' } },
    { id: 'Messy', name: 'Nhiệt tình', icon: '🤤', descriptions: { vi: 'Ăn say mê, nước sốt dính đầy môi, biểu cảm cực kỳ thèm thuồng.', en: 'Eating passionately, sauce smeared on lips, extremely craving expression.', zh: '吃得津津有味，满脸酱汁，极度渴望的表情。' } },
  ];

  const veggies = [
    { vi: "xà lách xoăn xanh mướt, cà chua bi đỏ mọng, ngô ngọt vàng ươm và dưa chuột bao tử giòn", en: "curly green lettuce, juicy red cherry tomatoes, golden sweet corn, and crisp baby cucumbers", zh: "翠绿的卷生菜，多汁的红圣女果，金黄的甜玉米和清脆的小黄瓜" },
    { vi: "ớt chuông 3 màu (xanh, đỏ, vàng) thái lát rực rỡ, bắp cải tím và măng tây xanh hấp sơ", en: "vibrant sliced tri-color bell peppers, purple cabbage, and lightly steamed green asparagus", zh: "亮眼的三色灯笼椒片，紫甘蓝和清蒸绿芦笋" },
    { vi: "rau thơm tươi xanh, dứa vàng mật, cà rốt tỉa hoa rực rỡ và đậu rồng xanh mướt", en: "fresh green herbs, honey yellow pineapple, vibrantly carved carrots, and lush green winged beans", zh: "新鲜青香草，蜜黄色菠萝，鲜艳的雕花胡萝卜和翠绿的四棱豆" }
  ];

  const drinks = [
    { vi: "ly nước ép cam tươi có đá lấp lánh và lát cam trang trí", en: "fresh orange juice with sparkling ice and an orange slice garnish", zh: "新鲜橙汁配晶莹冰块和橙片装饰" },
    { vi: "lon Coca-Cola đầy bọt sủi lấp lánh với những hạt sương lạnh bám quanh vỏ lon", en: "fizzy Coca-Cola with carbonated bubbles and cold condensation on the can", zh: "满是气泡的冰镇可乐，罐身挂满冷霜" },
    { vi: "ly trà đào sả thơm lừng với miếng đào vàng óng và lá bạc hà", en: "aromatic peach lemongrass tea with golden peach slices and mint leaves", zh: "芳香的桃子香茅茶配金色桃片和薄荷叶" }
  ];

  // randomOutfits removed

  const handleDurationChange = (type) => {
    if (type === 'plus') setDuration(prev => prev + 12);
    else setDuration(prev => Math.max(12, prev - 12));
  };

  const getFoodDetails = (selectedTheme: string) => {
    const themeToUse = selectedTheme === 'Random' 
      ? themes[Math.floor(Math.random() * (themes.length - 2)) + 1].id // Skip Random and Custom
      : selectedTheme;

    const variations = [
      "hấp dẫn", "đầy ắp", "siêu khổng lồ", "nóng hổi", "rực rỡ sắc màu"
    ];
    const v = variations[Math.floor(Math.random() * variations.length)];

    switch(themeToUse) {
      case 'GiantSeafood': {
        const seafoodVariants = [
          { 
            vi: `Khay hải sản ${v}: 2 con cua hoàng đế đỏ au, 5 con bào ngư lớn phủ sốt mỡ hành xanh mướt, 10 con tôm hùm đất sốt cajun đỏ thẫm.`, 
            en: `A ${v} seafood tray: 2 bright red King Crabs, 5 large abalones with green scallion oil, 10 crawfish in dark red Cajun sauce.`, 
            zh: `一盘${v}的海鲜拼盘：2只通红的帝王蟹，5只铺满翠绿葱油的大鲍鱼，10只深红卡真酱小龙虾。` 
          },
          {
            vi: `Mâm hải sản nướng mâm đồng ${v}: Tôm hùm Alaska nướng phô mai, mực trứng nướng muối ớt, bạch tuộc sốt sa tế đỏ rực.`,
            en: `A ${v} grilled seafood platter: Alaska lobster with cheese, grilled squid with chili salt, and bright red sate octopus.`,
            zh: `${v}的烤海鲜大拼盘：芝士焗阿拉斯加龙虾，红椒盐烤鱿鱼，以及火红沙茶酱烤章鱼。`
          }
        ];
        return seafoodVariants[Math.floor(Math.random() * seafoodVariants.length)];
      }
      case 'ShellfishWorld': {
        const shellfishVariants = [
          {
            vi: `Mâm ốc đa dạng ${v}: ốc hương xào trứng muối vàng ruộm, ốc móng tay xào rau muống xanh ngắt, ốc len xào dừa trắng ngậy.`,
            en: `A ${v} diverse shellfish platter: snails in golden salted egg sauce, razor clams with vibrant green morning glory, sea snails in creamy white coconut sauce.`,
            zh: `${v}的多样化贝类拼盘：金黄咸蛋黄酱炒花螺，翠绿空心菜炒蛏子，奶白椰汁炒大螺。`
          },
          {
            vi: `Khay ốc nướng lửa hồng ${v}: Sò lông nướng mỡ hành lạc rang, ốc nhồi thịt hấp sả, hàu nướng phô mai tan chảy.`,
            en: `A ${v} grilled shell tray: Grilled blood cockles with scallion oil, steamed stuffed snails with lemongrass, and melted cheese oysters.`,
            zh: `${v}的炭烤贝类托盘：葱油花生酱烤毛蚶，香茅蒸酿田螺，以及融化芝士焗生蚝。`
          }
        ];
        return shellfishVariants[Math.floor(Math.random() * shellfishVariants.length)];
      }
      case 'LobsterFeast': {
        const lobsterVariants = [
          {
            vi: `Khay tôm hùm thượng hạng ${v}: 3 con tôm hùm lớn phủ đầy sốt bơ tỏi vàng óng, phô mai chảy béo ngậy.`,
            en: `Premium lobster tray ${v}: 3 large lobsters drenched in golden garlic butter sauce, creamy melted cheese.`,
            zh: `${v}顶级龙虾拼盘：3只浇满金黄蒜香奶油酱的大龙虾，浓郁拉丝奶酪。`
          },
          {
            vi: `Đại tiệc tôm hùm đất ${v}: Tôm hùm đất sốt bơ cay nồng, ngô ngọt, xúc xích và khoai tây bi.`,
            en: `A ${v} crawfish feast: Spicy butter sauce crawfish, sweet corn, sausages, and baby potatoes.`,
            zh: `${v}小龙虾盛宴：香辣奶油酱小龙虾，甜玉米，香肠和小土豆。`
          }
        ];
        return lobsterVariants[Math.floor(Math.random() * lobsterVariants.length)];
      }
      case 'SpicyMixed': {
        const spicyVariants = [
          {
            vi: `Combo đỏ rực rỡ ${v}: gà chiên sốt cay Hàn Quốc đỏ bóng, tteokbokki dẻo quánh, kim chi đỏ thẫm.`,
            en: `A ${v} vibrant red combo: shiny red Korean spicy fried chicken, chewy tteokbokki, dark red kimchi.`,
            zh: `${v}火红特供组合：红亮辛辣的韩式炸鸡，软糯的炒年糕，深红泡菜。`
          },
          {
            vi: `Khay chân gà sả tắc ${v}: Chân gà rút xương ngâm sả tắc cay nồng, gân bò dầm cóc bao tử giòn tan.`,
            en: `A ${v} spicy chicken feet tray: Boneless chicken feet marinated with lemongrass and kumquat, crunchy beef tendon with baby ambarella.`,
            zh: `${v}酸辣凤爪托盘：香辣酸豆风味无骨鸡爪，清脆牛筋配小沙梨。`
          }
        ];
        return spicyVariants[Math.floor(Math.random() * spicyVariants.length)];
      }
      case 'FriedCrispy': {
        const friedVariants = [
          {
            vi: `Khay đồ chiên vàng ruộm ${v}: đùi gà rán giòn tan, khoai tây chiên lắc phô mai, mực vòng chiên xù.`,
            en: `A ${v} crispy golden tray: crunchy fried chicken drumsticks, cheese-shaked fries, breaded calamari rings.`,
            zh: `${v}金黄酥脆拼盘：嘎嘣脆的炸鸡腿，芝士薯条，酥炸鱿鱼圈. `
          },
          {
            vi: `Mẹt nem chua rán ${v}: Nem chua rán giòn, phô mai que kéo sợi, khoai tây mặt cười ngộ nghĩnh.`,
            en: `A ${v} fried fermented pork roll tray: Crispy fried fermented pork rolls, stretchy cheese sticks, funny smiley fries.`,
            zh: `${v}炸酸肉拼盘：酥炸酸肉，拉丝芝士棒，可爱笑脸薯条。`
          }
        ];
        return friedVariants[Math.floor(Math.random() * friedVariants.length)];
      }
      case 'SpicyNoodles': return {
        vi: "Thố mì cay khổng lồ: sợi mì vàng óng trong nước dùng đỏ sẫm, phủ đầy tôm tươi, mực viên, nấm linh chi trắng, bò viên và lớp trứng chần lòng đào đẹp mắt, điểm xuyết hành lá xanh và ớt lát",
        en: "Giant spicy noodle bowl: golden noodles in dark red broth, topped with fresh shrimp, squid balls, white shimeji mushrooms, beef balls, and a beautiful poached egg, garnished with green onions and sliced chilies",
        zh: "巨型辣味汤面：深红汤头里的金黄面条，铺满鲜虾、鱿鱼丸、白灵菇、牛肉丸和漂亮的温泉蛋，点缀着绿葱花和辣椒片"
      };
      case 'SushiSashimi': return {
        vi: "Mâm Nhật Bản rực rỡ: các lát sashimi cá hồi cam tươi, cá ngừ đỏ mọng, tôm ép trứng vàng-xanh, sushi bọc lươn nâu bóng, kèm gừng hồng nhạt và khối mù tạt xanh lá cây bắt mắt",
        en: "Vibrant Japanese platter: bright orange salmon sashimi, juicy red tuna, yellow/green shrimp with roe, shiny brown eel sushi, served with light pink ginger and a pop of green wasabi",
        zh: "鲜艳的和风拼盘：鲜橙色的三文鱼片，深红的金枪鱼，黄绿色的虾籽虾，棕亮的鳗鱼寿司，配上淡粉色姜片和翠绿的山葵"
      };
      case 'BoiledMixed': return {
        vi: "Khay Healthy xanh mát: súp lơ xanh mướt, ngô bao tử vàng nhạt, trứng luộc lòng đào vàng óng, thịt ức gà trắng nõn, kèm những lát bơ sáp xanh ngọc và nước chấm tương đen tương phản",
        en: "Fresh green healthy tray: vibrant green broccoli, baby corn, golden soft-boiled eggs, snow-white chicken breast, with jade green avocado slices and contrasting black dipping sauce",
        zh: "清爽健康拼盘：翠绿西兰花，淡黄小玉米，金黄溏心蛋，雪白鸡胸肉，配上翡翠色的牛油果片和深色蘸酱"
      };
      case 'RawSpicy': return {
        vi: "Combo hải sản sống độc đáo: cua ngâm tương đen óng ánh gạch đỏ, tôm sống sốt thái đỏ cam rực lửa, mực sống trong veo, rắc rất nhiều vừng trắng, tỏi lát xanh và ớt đỏ xắt nhỏ",
        en: "Unique raw seafood combo: soy-marinated crabs with bright red roe, fiery red-orange Thai sauce raw shrimp, crystal clear raw squid, topped with white sesame, green garlic slices, and red chilies",
        zh: "特色生腌拼盘：黑亮酱汁浸泡且带红膏的酱蟹，火红泰式酱生虾，晶莹剔透的生小鱿鱼，撒满白芝麻、绿蒜片和红椒末"
      };
      case 'SweetCombo': return {
        vi: "Khay tráng miệng đa sắc: bánh Macaron đủ màu tím, hồng, xanh, bánh gato phủ kem trắng điểm dâu tây đỏ, thạch trái cây trong suốt chứa những miếng xoài vàng và kiwi xanh lá",
        en: "Multi-colored dessert tray: purple, pink, and blue Macarons, white cream cake with red strawberries, transparent fruit jelly with yellow mango and green kiwi chunks",
        zh: "缤纷甜点拼盘：紫、粉、蓝色的马卡龙，点缀着红草莓的奶油蛋糕，藏着黄芒果和绿奇异果块的透明果冻"
      };
      case 'BunDauMamTom': return {
        vi: "Mẹt bún đậu mắm tôm siêu to: bún lá trắng ngần, đậu hũ chiên vàng giòn rụm, thịt chân giò luộc, chả cốm xanh mướt dẻo thơm, dồi sụn nướng xém cạnh, ăn kèm mắm tôm đánh bọt trắng xốp vắt chanh ớt rực rỡ.",
        en: "Giant Bun Dau Mam Tom tray: pristine white pressed vermicelli, crispy golden fried tofu, boiled pork leg, green young rice sausage, char-grilled cartilage sausage, served with fluffy whipped shrimp paste with lemon and chili.",
        zh: "巨型虾酱豆腐米粉拼盘：洁白压实的米粉块，外酥里嫩的金黄炸豆腐，白水煮猪腿肉，翠绿软糯的青米肠，烤至微焦的软骨肠，配上挤了柠檬和辣椒的蓬松虾酱。"
      };
      case 'GiantPho': return {
        vi: "Tô phở bò khổng lồ bốc khói nghi ngút: nước dùng trong vắt thanh ngọt, bánh phở mềm dai, xếp đầy những lát thịt bò tái hồng đào, gầu bò mỡ vàng giòn, bò viên nảy sần sật, rắc đầy hành lá xanh.",
        en: "Steaming giant bowl of Beef Pho: clear sweet broth, soft and chewy white rice noodles, topped with pink medium-rare beef slices, crispy yellow fatty brisket, bouncy beef meatballs, sprinkled with green onions.",
        zh: "热气腾腾的巨无霸牛肉河粉：清澈鲜甜的高汤，软弹的白色河粉，铺满粉嫩的半熟牛肉片，金黄酥脆的肥牛腩，弹牙的牛肉丸，撒满葱花和刺芹。"
      };
      case 'BanhMiChao': return {
        vi: "Chảo gang xèo xèo nóng hổi: 2 quả trứng ốp la lòng đào vàng ươm, pate gan dẻo thơm, xúc xích đỏ rực cháy xém, phô mai tan chảy dẻo quánh, thịt bít tết ngập nước sốt tiêu đen sẫm màu, kèm bánh mì nóng giòn rụm.",
        en: "Sizzling hot cast iron pan: 2 golden runny sunny-side-up eggs, fragrant rich liver pâté, scored red sausages, gooey melted cheese, beef steak smothered in thick black pepper sauce, served with hot crispy baguettes.",
        zh: "滋滋作响的热铁锅：2只金黄流心的煎蛋，香气浓郁的猪肝酱，烤出焦边的开花红香肠，融化拉丝的奶酪，泡在浓稠黑胡椒酱中的牛排，配以热腾腾的酥脆法式长棍面包。"
      };
      case 'TomYumHotpot': return {
        vi: "Nồi lẩu Thái Tom Yum đỏ cam rực rỡ sôi sùng sục: nước lẩu sóng sánh mỡ đỏ, nhúng tôm sú tươi xanh khổng lồ, mực ống trắng muốt, nghêu béo ngậy, nấm kim châm trắng, điểm xuyết lá chanh xanh và ớt xắt xéo.",
        en: "Boiling vibrant red-orange Tom Yum hotpot: broth rich with chili oil, dipping giant fresh green tiger prawns, pristine white sliced squid rings, plump clams, white enoki mushrooms, garnished with green lime leaves and chilies.",
        zh: "沸腾的鲜艳红橙色冬阴功火锅：飘着红油的浓郁汤底，涮煮着巨大的新鲜黑虎虾，洁白的鱿鱼圈，饱满的蛤蜊，白金针菇，点缀着绿色的青柠叶和斜切红辣椒。"
      };
      case 'ComTam': return {
        vi: "Đĩa cơm tấm Sài Gòn đầy ắp: hạt cơm trắng tơi xốp, sườn cốt lết nướng to bản cháy xém rìa phủ vân mỡ óng ánh, chả trứng hấp vàng rực, bì heo thái sợi mỏng, rưới mỡ hành xanh mướt và chén mắm chua ngọt sẫm màu.",
        en: "Heaping plate of Saigon Broken Rice: fluffy white broken rice grains, a massive grilled pork chop with charred edges and glistening marbled fat, vibrant yellow steamed egg meatloaf, thinly shredded pork skin, drizzled with green scallion oil.",
        zh: "满满一盘的西贡碎米饭：松软洁白的碎米粒，巨大一块边缘微焦且泛着油光的烤排骨，鲜黄的蒸蛋肉饼，细切猪皮丝，淋上翠绿葱油，配酸甜鱼露。"
      };
      case 'BunBoHue': return {
        vi: "Tô bún bò Huế khổng lồ siêu nhiều topping: cọng bún to tròn dai mướt, nước lẩu đỏ rực màu hạt điều, khoanh giò heo ngập mỡ bì giòn dai, chả cua vàng gạch, thịt bò bắp hoa trong veo, ăn cùng hoa chuối tím thái sợi.",
        en: "Giant Bun Bo Hue bowl overflowing with toppings: thick chewy vermicelli, vibrant red cashew-colored broth, colossal pork trotters with chewy skin, golden crab meatloaf, beef shank with translucent tendons, eaten with shredded purple banana blossom.",
        zh: "配料爆满的巨型顺化牛肉粉：粗圆劲道的米粉，泛着胭脂树红色彩的高汤，带着Q弹肉皮的巨大猪蹄，金灿灿的蟹肉饼，带着透明牛筋的牛腱肉，搭配紫色的香蕉花丝。"
      };
      case 'GrilledLambLeg': return {
        vi: "Chiếc đùi cừu khổng lồ nướng nguyên tảng mật ong: lớp da ngoài cháy xém caramelized vân nướng sậm màu, bên trong thịt đỏ tía mềm mọng nước đang rỉ mỡ bóng bẩy, rắc lá hương thảo xanh và tiêu sống hạt to.",
        en: "Giant honey-glazed roasted whole leg of lamb: caramelized charred outer skin with dark grill marks, deep red juicy tender meat inside oozing glistening fat, sprinkled with green rosemary and raw large peppercorns.",
        zh: "巨型蜜汁烤全羊腿：外皮焦糖化且带有深色烤网纹路，内里紫红色、鲜嫩多汁的肉正渗出亮晶晶的油脂，撒上翠绿的迷迭香和粗生胡椒。"
      };
      case 'ClayBakedChicken': return {
        vi: "Cảnh bóc lớp đất sét nung xám đen: hiện ra con gà ta nướng nguyên con da vàng ươm óng ả, thịt trắng mọng khói bốc lên ngùn ngụt, chảy mỡ vàng ươm nhễ nhại, chấm điểm hỗn hợp chẩm chéo xanh đỏ cay nồng.",
        en: "Breaking open gray-black baked clay: revealing a whole roasted chicken with shiny golden skin, stringy juicy white meat releasing billowing smoke, dripping with golden fat, dipped in vibrant red-green Cham Cheo sauce.",
        zh: "敲开灰黑色的烤泥层：露出一只带着发亮金黄外皮的烤全鸡，白色嫩肉冒着滚滚白烟，滴下金灿灿的油脂，蘸着鲜艳红绿色的特色香辣蘸料。"
      };
      case 'GiantBurger': return {
        vi: "Chiếc Hamburger khổng lồ cao 5 tầng chót vót: bọc bởi bánh mì hạt vừng vàng giòn, 5 miếng thịt bò Wagyu siêu dày đang chảy nước thịt ròng ròng, kẹp phô mai cheddar cam nóng chảy nhỏ giọt, xà lách xanh mướt, vòng hành tây chiên xù.",
        en: "Towering 5-story giant Hamburger: covered in golden crispy sesame seed buns, sandwiching 5 extra-thick Wagyu beef patties dripping with juices, layered with dripping melted orange cheddar cheese, crisp green lettuce, crispy onion rings.",
        zh: "高耸的5层巨无霸汉堡：夹在金黄酥脆的芝麻小圆面包之间，内有5块超厚、正滴着肉汁的和牛汉堡排，夹杂着滴落的融化橙色切达奶酪，翠绿的生菜，以及酥脆的炸洋葱圈。"
      };
      case 'SeafoodPizza': return {
        vi: "Chiếc Pizza hải sản viền phô mai khổng lồ: đế mỏng nướng củi lốm đốm xém đen, bề mặt phủ ngập phô mai Mozzarella kéo sợi dài lê thê chưa đứt, cắm đầy tôm nõn đỏ hồng, mực vòng trắng tinh, ớt chuông xanh đỏ.",
        en: "Giant cheese-stuffed crust seafood Pizza: thin wood-fired crust with charred spots, surface completely flooded with Mozzarella cheese pulling endlessly long strings, studded with plump pink shrimps, white squid rings, red/green bell peppers.",
        zh: "巨型芝士夹心边海鲜比萨：带有微焦斑点的超薄柴火烤制饼底，表面铺满拉丝绵长不断的马苏里拉奶酪，点缀着饱满的粉红虾仁，纯白的鱿鱼圈，红绿灯笼椒。"
      };
      case 'WagyuSteak': return {
        vi: "Khay phi lê bò Wagyu A5 nướng: hai tảng thịt xém mặt ngoài rỉ mỡ xèo xèo, thái ngang lộ ra phần lõi hồng đào medium-rare có các đường vân mỡ cẩm thạch trắng lấp lánh, chảy nước thịt tràn trề.",
        en: "Premium grilled A5 Wagyu beef fillet tray: two steaks sporting seared crusts sizzling with fat, thinly sliced to reveal a medium-rare pink center with glittering white marbling, overflowing with meat juices.",
        zh: "顶级碳烤A5和牛菲力托盘：两块外表烤至焦褐滋滋冒油的牛排，切开露出五分熟带血色的粉红内心和闪烁着白光的雪花纹路，肉汁充盈流淌。"
      };
      case 'BBQRibs': return {
        vi: "Tảng sườn non nướng BBQ kiểu Mỹ khổng lồ: khúc xương sườn xếp lớp bọc trong thịt hun khói nướng, nhúng ngập trong lớp nước sốt BBQ nâu sẫm óng ánh dẻo nhẹo, dùng kèm khoai tây chiên giòn.",
        en: "Giant slab of American BBQ baby back ribs: rib bones tightly coated in smoked roasted meat, smothered in a glistening, thick, dark brown BBQ sauce, served with crispy fries.",
        zh: "一块巨大的美式BBQ碳烤猪肋排：骨头包裹在烟熏烤肉中，浸透了闪亮、浓稠、粘稠的深棕色BBQ烧烤酱，配上酥脆的薯条。"
      };
      case 'KoreanAssorted': return {
        vi: "Mẹt ăn vặt Hàn Quốc rực rỡ: kimbap cuộn rong biển ngập nhân vàng-đỏ, dồi huyết Sundae đen sẫm óng ánh, chả cá xiên ngoằn ngoèo trong súp, gà rán sốt tương tỏi rắc vừng trắng.",
        en: "Vibrant assorted Korean street food platter: glistening seaweed-wrapped kimbap bursting with yellow/red fillings, shiny dark blood sausage (Sundae), zigzag fish cake skewers, soy-garlic fried chicken.",
        zh: "色彩缤纷的韩国街头小吃大拼盘：闪亮海苔包裹的紫菜包饭，内陷填满黄红色食材；泛着油光的深色血肠；淡黄色汤汁中的曲折鱼糕串；大蒜酱油炸鸡。"
      };
      case 'WesternFruit': return {
        vi: "Thau trái cây miền Tây tươi rói khổng lồ: mít Thái vàng rực múi to, sầu riêng béo ngậy, bơ xanh ngọc mướt mát, hạt đác trong veo, dâu tây đỏ au, tất cả chan ngập nước cốt dừa đặc sánh rắc đậu phộng.",
        en: "Giant bowl of fresh Western Vietnam fruits: vibrant yellow round Thai jackfruit pods, creamy buttery durian, jade-green avocado pieces, translucent palm seeds, red strawberries, all drenched in thick pristine coconut milk.",
        zh: "一大盆新鲜的越南西部水果：鲜黄圆润的泰式菠萝蜜肉，奶油般肥美的榴莲，翡翠色的饱满牛油果，透明亚答子，鲜红草莓，全部淋满浓稠的白椰奶。"
      };
      case 'GiantCandy': return {
        vi: "Khay đồ ngọt khổng lồ ngập tràn sắc đa sắc: kẹo dẻo gấu gummy lấp lánh đủ màu, chupa chups tròn xoe, marshmallow xốp mềm trắng hồng, thỏi socola nâu đen ánh vàng, thạch phô mai núng nính rắc cốm li ti.",
        en: "Giant sweet tray overflowing with multi-colored luster: sparkling multi-colored gummy bears, shiny round lollipops, fluffy soft pink/white marshmallows, dark chocolate bars, and jiggly cheese jelly dotted with tiny sprinkles.",
        zh: "盛满缤纷光泽的巨型糖果托盘：闪烁着五颜六色光芒的小熊软糖，闪亮的棒棒糖，蓬松柔软的粉白棉花糖，深棕带金光巧克力块，以及撒有微小彩虹糖粒的果冻。"
      };
      case 'DurianFruit': return {
        vi: "Khay sầu riêng Ri6 khổng lồ chín vàng: những múi sầu riêng to bằng bàn tay, màu vàng đậm óng ả, béo ngậy như bơ, thơm lừng lan tỏa, rưới thêm sữa đặc và đậu phộng.",
        en: "Giant tray of ripe yellow Ri6 durian: hand-sized pods with vibrant deep yellow color, creamy as butter, intense aroma filling the space, drizzled with condensed milk and peanuts.",
        zh: "一盘巨大的成熟金黄Ri6榴莲：巴掌大的榴莲果肉，呈现鲜艳的深黄色，像奶油一样肥美，浓郁的香味，淋上炼乳和花生。"
      };
      case 'IceCreamTray': return {
        vi: "Thố kem khổng lồ bốc khói đá khô: 10 viên kem đủ vị dâu đỏ, vani trắng, socola nâu, trà xanh, phủ sốt chocolate bóng lộn, đậu phộng, bánh quế giòn.",
        en: "Giant ice cream bowl with dry ice smoke: 10 scoops including red strawberry, white vanilla, brown chocolate, green tea, topped with glossy chocolate sauce, peanuts, and crispy wafers.",
        zh: "冒着干冰白烟的巨型冰淇淋碗：10个球，包括红色草莓、白色香草、棕色巧克力、绿色抹茶，淋上油亮的巧克力酱、花生和酥脆威化饼。"
      };
      case 'GiantBibimbap': return {
        vi: "Thố cơm trộn Hàn Quốc khổng lồ: cơm trắng phủ mầm đá, nấm, cà rốt, thịt bò xào, trứng ốp la lòng đào rắc vừng, trộn đều với sốt Gochujang đỏ rực sền sệt.",
        en: "Giant Korean Bibimbap bowl: steamed rice topped with sprouts, mushrooms, carrots, sautéed beef, a sunny-side-up egg with sesame seeds, mixed with thick vibrant red Gochujang sauce.",
        zh: "巨型韩式石锅拌饭：白米饭上铺满豆芽、蘑菇、胡萝卜、炒牛肉和撒有芝麻的流心蛋，拌入浓稠火红的苦椒酱。"
      };
      case 'HotTakoyaki': return {
        vi: "Khay 24 viên Takoyaki nóng hổi: vỏ bánh vàng ruộm, bên trong là nhân bạch tuộc giòn, rưới sốt Teriyaki nâu bóng, sốt Mayo trắng sọc, rắc cá bào Katsuobushi nhảy múa.",
        en: "A tray of 24 piping hot Takoyaki: golden crust, crunchy octopus chunks inside, drizzled with glossy brown Teriyaki and white Mayo zigzags, topped with dancing Katsuobushi flakes.",
        zh: "一盘24颗热气腾腾的章鱼小丸子：金黄外皮，内藏弹牙章鱼块，浇上油亮的棕色照烧酱和白色美乃滋，撒上跳动的鲣鱼片。"
      };
      default: return {
        vi: "Màn trình diễn món ăn rực rỡ sắc màu, phong phú và tràn đầy sự ngon mắt.",
        en: "A vibrant, rich, and visually appetizing food performance.",
        zh: "一场色彩鲜艳、丰富且极具视觉诱惑力的美食表演。"
      };
    }
  };

  const generatePrompts = async () => {
    if (apiKeys.length === 0) {
      alert("Vui lòng nhập API Key để sử dụng các tính năng AI của hệ thống.");
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedPrompts(null);
    const sessionSeed = Math.floor(Math.random() * 1000000);

    let translatedCustomFood = { vi: customFood, en: customFood, zh: customFood };
    if (theme === 'Custom' && customFood) {
      try {
        const translationStr = await executeAiWithFallback(apiKeys, activeApiKeyIndex, setActiveApiKeyIndex, async (genAI) => {
          const response = await genAI.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `Translate the following food name into English and standard Chinese (Simplified). Output raw JSON only, no markdown formatting. Format: {"en": "...", "zh": "..."}\n\nFood: ${customFood}`
          });
          return response.text;
        });

        if (translationStr) {
           const cleanedStr = translationStr.replace(/```json/g, '').replace(/```/g, '').trim();
           const parsed = JSON.parse(cleanedStr);
           translatedCustomFood = { vi: customFood, en: parsed.en || customFood, zh: parsed.zh || customFood };
        }
      } catch (e: any) {
         console.warn("AI Translation failed:", e);
         alert("Lỗi khi kết nối AI: " + e.message + "\nTự động chuyển về tiếng Việt cho bản dịch.");
      }
    }

    const promptList: any[] = [];
    const numPrompts = Math.floor(duration / 4);

    for (let i = 0; i < numPrompts; i++) {
        const createPromptForLang = (langKey: "vi" | "en" | "zh") => {
          const food = theme === 'Custom' ? translatedCustomFood : getFoodDetails(theme);

          const labels = {
            vi: ["Bối cảnh", "Thời gian/Môi trường", "Phong cách", "Vẻ ngoài nhân vật", "Trang phục", "Đồ ăn", "Góc quay/Điểm nhìn", "Ánh sáng", "Âm thanh/Cảm giác", "Lưu ý", "Quảng cáo Sản phẩm", "Cảm xúc & Cách ăn"],
            en: ["Setting", "Time/Environment", "Style", "Character Appearance", "Outfit", "Food", "Camera Angle/POV", "Lighting", "Sound/Vibe", "Note", "Product Placement", "Mood & Eating Style"],
            zh: ["背景", "时间/环境", "风格", "角色外观", "服装", "食物", "相机角度/视角", "灯光", "声音/感觉", "注意", "产品放置", "情感与饮食风格"]
          }[langKey] || [];

          const timeVal = {
            vi: "Bạn ngày rực rỡ, ánh sáng tràn ngập.",
            en: "Bright daytime, flooded with light.",
            zh: "阳光明媚的白天，光线充足。"
          }[langKey];

          const styleVal = {
            vi: "Cinematic 4K, siêu chân thực, sắc nét đến từng chi tiết.",
            en: "Cinematic 4K, hyper-realistic, sharp details.",
            zh: "电影级 4K，超逼真，细节清晰。"
          }[langKey];

          const charStr = charNamesList.slice(0, numCharacters).map(name => `${name} (Mukbanger)`).join(", ");
          
          const selectedCameraObj = cameraStyles.find(c => c.id === cameraStyle);
          const cameraVal = selectedCameraObj?.descriptions[langKey as "vi" | "en" | "zh"];

          const lightVal = {
            vi: "Ánh sáng spotlight hắt lên đồ ăn làm nổi bật độ bóng bẩy, mọng nước.",
            en: "Spotlight illuminating the food, highlighting its juicy and glossy texture.",
            zh: "聚光灯照亮食物，突出其多汁和油亮的质感。"
          }[langKey];

          const soundVal = {
            vi: "Tập trung hiệu ứng ASMR: tiếng nhai giòn rụm, tiếng húp nước sột soạt.",
            en: "ASMR focus: crunchy chewing sounds, loud slurping.",
            zh: "ASMR 焦点：清脆的咀嚼声，大声呼噜声。"
          }[langKey];

          const noTextNote = {
            vi: "KHÔNG chèn thêm bất kỳ văn bản, chữ, logo lạ nào vào hình ảnh.",
            en: "DO NOT add any text, typography, or random logos onto the image.",
            zh: "请勿在图片中添加任何文字、排版或随机徽标。"
          }[langKey];

          // randomOutfits and shuffledOutfits removed.

          const outfitDesc = outfitMode === 'Cameo' 
            ? {
                vi: "Trang phục cameo gốc",
                en: "Original cameo outfit",
                zh: "原创 cameo 服装"
              }[langKey] || ""
            : {
                vi: "AI sẽ tự động gợi ý trang phục hợp với chủ đề đã lựa chọn đó",
                en: "AI will automatically suggest an outfit that matches the selected theme",
                zh: "AI 将自动建议适合所选主题的服装"
              }[langKey] || "";

          let outfitStr = charNamesList.slice(0, numCharacters).map(name => `${name}: ${outfitDesc}`).join(", ");

          const settingVal = settingMode === 'Cameo'
            ? {
                vi: "Bối cảnh cameo gốc",
                en: "Original cameo setting",
                zh: "原创 cameo 背景"
              }[langKey] || ""
            : {
                vi: "Bối cảnh tùy chọn (phù hợp với từng chủ đề đã lựa chọn)",
                en: "Custom setting matching the selected theme",
                zh: "适合所选主题的自定义背景"
              }[langKey] || "";

          const foodStr = {
            vi: `${food.vi}, kèm theo ${veggies[i % veggies.length].vi} và ${drinks[i % drinks.length].vi}.`,
            en: `${food.en}, served with ${veggies[i % veggies.length].en} and ${drinks[i % drinks.length].en}.`,
            zh: `${food.zh}，配以${veggies[i % veggies.length].zh}和${drinks[i % drinks.length].zh}。`
          }[langKey];

          const getEatingAction = (style: string, lang: "vi" | "en" | "zh") => {
            const actions = {
              Hectic: {
                vi: "liên tục cắn những miếng cực lớn, nhai dồn dập, tay vừa nuốt xong đã gắp miếng mới",
                en: "taking massive bites continuously, chewing vigorously, grabbing a new piece before finishing the current one",
                zh: "不断大口咬下，用力咀嚼，还没咽下就抓起新的一块"
              },
              Steady: {
                vi: "thong thả gắp đồ ăn, nhai chậm rãi cảm nhận hương vị, thỉnh thàng gật gù tâm đắc",
                en: "picking up food leisurely, chewing slowly to savor the taste, occasionally nodding in appreciation",
                zh: "悠闲地夹起食物，慢条斯理地咀嚼感悟味道，不时点头赞赏"
              },
              Elegant: {
                vi: "dùng nĩa/đũa nhẹ nhàng, đưa vào miệng từ tốn, lau miệng bằng khăn giấy sau mỗi vài miếng",
                en: "using fork/chopsticks gently, putting food in mouth politely, wiping mouth with tissue every few bites",
                zh: "轻柔地使用叉子/筷子，礼貌地将食物送入口中，每吃几口就用纸巾擦嘴"
              },
              Messy: {
                vi: "ăn một cách nhiệt tình đến mức nước sốt dính đầy xung quanh miệng, liếm môi đầy thèm thuồng",
                en: "eating so passionately that sauce smears all over the lips, licking lips showing intense craving",
                zh: "吃得非常投入，酱汁沾满嘴唇周围，贪婪地舔着嘴唇"
              }
            };
            return actions[style as keyof typeof actions][lang];
          };

          const eatingActionDesc = getEatingAction(eatingStyle, langKey as "vi" | "en" | "zh");
          const selectedEatingStyleObj = eatingStyles.find(es => es.id === eatingStyle);
          const partIndex = i % 3;
          let timelineContent = "";

          if (partIndex === 0) {
            if (theme === 'ShellfishWorld') {
              timelineContent = {
                vi: `Timeline Chi Tiết:\n0-3s: Camera Macro bắt cận mâm ${food.vi} bốc khói nghi ngút. ${charNamesList[0]} nhặt một con ốc to nhất.\n3-6s: Dùng tăm/que nhỏ khéo léo nhể phần thịt ốc mọng nước ra khỏi vỏ.\n6-9s: Chấm đẫm miếng thịt ốc vào bát nước mắm tỏi ớt và đưa vào miệng, ${eatingActionDesc.toLowerCase()}.\n9-12s: Biểu cảm bùng nổ vị giác khi thưởng thức miếng ốc giòn sần sật, ${numCharacters > 1 ? charNamesList.slice(1, numCharacters).join(' và ') + ' cũng bắt đầu hưởng ứng.' : 'miệng chép lia lịa.'}`,
                en: `Detailed Timeline:\n0-3s: Macro shot of steaming ${food.en}. ${charNamesList[0]} picks up a large snail.\n3-6s: Skillfully uses a toothpick to extract the juicy snail meat from the shell.\n6-9s: Dips the meat deeply into the fish sauce and puts it into mouth, ${eatingActionDesc.toLowerCase()}.\n9-12s: Flavor explosion expression enjoying the crunchy snail, ${numCharacters > 1 ? charNamesList.slice(1, numCharacters).join(' and ') + ' starts joining in.' : 'licking lips repeatedly.'}`,
                zh: `详细时间轴:\n0-3s: 微距捕捉冒热气的 ${food.zh}。${charNamesList[0]} 捡起一只最大的螺。\n3-6s: 熟练地用牙签将多汁的螺肉从壳中挑选出来。\n6-9s: 将螺肉深深浸入鱼露中并放入口中，${eatingActionDesc.toLowerCase()}。\n9-12s: 享受脆嫩螺肉时的味觉爆发表情，${numCharacters > 1 ? charNamesList.slice(1, numCharacters).join(' 和 ') + ' 也开始响应。' : '不断咂嘴。'}`
              }[langKey];
            } else {
              timelineContent = {
                vi: `Timeline Chi Tiết:\n0-3s: Camera Macro bắt cận mâm ${food.vi} bốc khói nghi ngút. ${charNamesList[0]} đưa tay gắp món chính đầu tiên với ánh mắt rạng rỡ.\n3-6s: ${charNamesList[0]} giơ miếng ăn to bản lên khoe độ bóng bẩy trước ống kính, ${eatingActionDesc}.\n6-9s: Cận cảnh hành động cắn ngập phần nhân mọng nước, để lộ kết cấu hấp dẫn bên trong.\n9-12s: Biểu cảm bùng nổ vị giác, nhắm mắt tận hưởng sự ngon lành, ${numCharacters > 1 ? charNamesList.slice(1, numCharacters).join(' và ') + ' cũng bắt đầu hưởng ứng.' : 'miệng chép lia lịa.'}`,
                en: `Detailed Timeline:\n0-3s: Macro shot of steaming ${food.en}. ${charNamesList[0]} reaches out for the first main dish with glowing eyes.\n3-6s: ${charNamesList[0]} holds a large piece up to show its glistening texture to the camera, ${eatingActionDesc}.\n6-9s: Close-up on biting into the juicy filling, revealing the tempting internal structure.\n9-12s: Flavor explosion expression, closing eyes to savor, ${numCharacters > 1 ? charNamesList.slice(1, numCharacters).join(' and ') + ' starts joining in.' : 'licking lips repeatedly.'}`,
                zh: `详细时间轴:\n0-3s: 微距拍摄冒热气的 ${food.zh}。${charNamesList[0]} 带着闪亮的眼神伸手去拿第一道主菜。\n3-6s: ${charNamesList[0]} 在镜头前展示一大块食物油亮的光泽，${eatingActionDesc}。\n6-9s: 特写咬入多汁内封的动作，露出诱人的内部结构。\n9-12s: 味觉爆发表情，闭眼享受美味，${numCharacters > 1 ? charNamesList.slice(1, numCharacters).join(' 和 ') + ' 也开始响应。' : '不断咂嘴。'}`
              }[langKey];
            }
          } else if (partIndex === 1) {
            if (theme === 'ShellfishWorld') {
              timelineContent = {
                vi: `Timeline Chi Tiết:\n0-3s: [Tiếp nối] Camera lướt qua khay ốc đầy ắp. ${charNamesList.slice(0, numCharacters).join(' và ')} đang nhặt và nhể ốc rất tập trung.\n3-6s: ${charNamesList[0]} nhặt con tiếp theo, nhể thịt ốc và chấm vào bát nước mắm nhiều ớt xanh đỏ.\n6-9s: Đưa vào miệng nhai miếng ốc giòn rụm, ${eatingActionDesc.toLowerCase()}, tiếng ASMR được đẩy lên cao trào.\n9-12s: Gật đầu lia lịa tâm đắc với bát nước mắm cay nồng, ${numCharacters > 1 ? 'mọi người cùng nhìn nhau cười vui vẻ' : charNamesList[0] + ' thể hiện sự thoả mãn tột độ'}.`,
                en: `Detailed Timeline:\n0-3s: [Action Continuity] Camera glides over the full food tray. ${charNamesList.slice(0, numCharacters).join(' and ')} are picking and extracting snails intensely.\n3-6s: ${charNamesList[0]} picks another one, extracting the meat and dipping it into the fish sauce.\n6-9s: Puts it into mouth chewing the crunchy snail, ${eatingActionDesc.toLowerCase()}, ASMR volume peaked.\n9-12s: Nodding enthusiastically at the spicy sauce, ${numCharacters > 1 ? 'everyone looking at each other laughing' : charNamesList[0] + ' showing extreme satisfaction'}.`,
                zh: `详细时间轴:\n0-3s: [动作延续] 镜头扫过盛满螺的托盘。${charNamesList.slice(0, numCharacters).join(' 和 ')} 正在专注地捡螺和挑螺肉。\n3-6s: ${charNamesList[0]} 捡起下一个，挑出螺肉并浸入鱼露中。\n6-9s: 放入口中咀嚼脆嫩螺肉，${eatingActionDesc.toLowerCase()}，ASMR 音量推向高潮。\n9-12s: 对辛辣蘸酱频频点头赞赏，${numCharacters > 1 ? '大家开心地互相看着' : charNamesList[0] + ' 表现出极度满足'}。`
              }[langKey];
            } else {
              timelineContent = {
                vi: `Timeline Chi Tiết:\n0-3s: [Tiếp nối] Camera lướt qua khay đồ ăn đầy ắp. ${charNamesList.slice(0, numCharacters).join(' và ')} đang ăn rất hăng say.\n3-6s: ${charNamesList[0]} ${eatingActionDesc}, tay vội vàng gắp miếng tiếp theo chấm đẫm nước sốt.\n6-9s: Cận cảnh khuôn mặt mãn nguyện khi nhai, tiếng ASMR được đẩy lên cao trào đầy kích thích.\n9-12s: Gật đầu lia lịa tâm đắc, ${numCharacters > 1 ? 'mọi người cùng nhìn nhau cười vui vẻ' : charNamesList[0] + ' thể hiện sự thoả mãn tột độ'}.`,
                en: `Detailed Timeline:\n0-3s: [Action Continuity] Camera glides over the full food tray. ${charNamesList.slice(0, numCharacters).join(' and ')} are eating passionately.\n3-6s: ${charNamesList[0]} ${eatingActionDesc}, hurriedly dipping the next piece into the thick sauce.\n6-9s: Close-up of the satisfied face while chewing, ASMR volume peaked for stimulation.\n9-12s: Nodding enthusiastically, ${numCharacters > 1 ? 'everyone looking at each other laughing' : charNamesList[0] + ' showing extreme satisfaction'}.`,
                zh: `详细时间轴:\n0-3s: [动作延续] 镜头扫过盛满食物的托盘。${charNamesList.slice(0, numCharacters).join(' 和 ')} 正在投入地吃。\n3-6s: ${charNamesList[0]} ${eatingActionDesc}，急忙将下一块食物浸入浓稠酱汁。\n6-9s: 特写咀嚼时满足的脸庞，ASMR 音量推向高潮，非常刺激。\n9-12s: 频频点头赞赏，${numCharacters > 1 ? '大家开心地互相看着' : charNamesList[0] + ' 表现出极度满足'}。`
              }[langKey];
            }
          } else {
            if (theme === 'ShellfishWorld') {
              timelineContent = {
                vi: `Timeline Chi Tiết:\n0-3s: Sau khi nuốt trôi phần ốc giòn sần sật cay nồng, ${charNamesList[0]} thở phào mãn nguyện, nhìn vào máy quay cười tươi.\n3-6s: Vươn tay cầm lấy ${drinks[i % drinks.length].vi}, ${numCharacters > 1 ? 'mọi người cùng nâng ly nhẹ.' : 'ánh mắt sảng khoái.'}\n6-9s: Cận cảnh uống một ngụm lớn, bọt ga sủi lấp lánh làm dịu đi cảm giác cay nóng của ớt xanh ớt đỏ.\n9-12s: Đặt ly xuống, tươi cười thoả mãn, tay nhắm sẵn con ốc to tiếp theo trên khay ${food.vi} vẫn còn đầy.`,
                en: `Detailed Timeline:\n0-3s: After swallowing the crunchy spicy snail, ${charNamesList[0]} sighs contentedly, smiling brightly at the camera.\n3-6s: Reaches out for ${drinks[i % drinks.length].en}, ${numCharacters > 1 ? 'everyone raises their glasses.' : 'refreshing look.'}\n6-9s: Close-up of taking a large gulp, sparkling fizz cooling the heat from green and red chilies.\n9-12s: Sets down the drink, smiling satisfied, targetting the next large snail on the full ${food.en} tray.`,
                zh: `详细时间轴:\n0-3s: 吞下脆嫩辛辣的螺肉后，${charNamesList[0]} 满足地舒了口气，对着摄影机灿烂一笑。\n3-6s: 伸手拿起 ${drinks[i % drinks.length].zh}，${numCharacters > 1 ? '大家举杯' : '神情爽快'}。\n6-9s: 特写大口畅饮，闪亮的气泡缓解了青红辣椒带来的辣意。\n9-12s: 放下杯子，满意地微笑，准备下一只大螺。`
              }[langKey];
            } else {
              timelineContent = {
                vi: `Timeline Chi Tiết:\n0-3s: Sau khi nuốt trôi miếng ngon, ${charNamesList[0]} thở phào mãn nguyện, nhìn vào máy quay cười tươi.\n3-6s: Vươn tay cầm lấy ${drinks[i % drinks.length].vi}, ${numCharacters > 1 ? 'mọi người cùng nâng ly nhẹ.' : 'ánh mắt sảng khoái.'}\n6-9s: Cận cảnh uống một ngụm lớn, bọt ga sủi lấp lánh làm dịu đi cảm giác béo ngậy/cay nồng.\n9-12s: Đặt ly xuống, tươi cười thoả mãn, chuẩn bị cho vòng ăn tiếp theo trên khay ${food.vi} vẫn còn đầy.`,
                en: `Detailed Timeline:\n0-3s: After swallowing the tasty bite, ${charNamesList[0]} sighs contentedly, smiling brightly at the camera.\n3-6s: Reaches out for ${drinks[i % drinks.length].en}, ${numCharacters > 1 ? 'everyone raises their glasses.' : 'refreshing look.'}\n6-9s: Close-up of taking a large gulp, sparkling fizz cooling the richness/spiciness.\n9-12s: Đặt ly xuống, tươi cười thoả mãn, chuẩn bị cho vòng ăn tiếp theo trên khay ${food.vi} vẫn còn đầy.`,
                zh: `详细时间轴:\n0-3s: 吞下美味后，${charNamesList[0]} 满足地舒了口气，对着摄影机灿烂一笑。\n3-6s: 伸手拿起 ${drinks[i % drinks.length].zh}，${numCharacters > 1 ? '大家举杯' : '神情爽快'}。\n6-9s: 特写大口畅饮，气泡缓解了辣感。\n9-12s: 放下杯子，满意地微笑，准备下一轮。`
              }[langKey];
            }
          }

          const moodWithEating = {
            vi: `Hào hứng, thèm thuồng, mắt sáng rực. Cách ăn: ${selectedEatingStyleObj?.descriptions.vi}`,
            en: `Excited, craving, eyes glowing. Eating style: ${selectedEatingStyleObj?.descriptions.en}`,
            zh: `兴奋，渴望，眼神放光。饮食风格: ${selectedEatingStyleObj?.descriptions.zh}`
          }[langKey];

          let finalPrompt = `${labels[0]}: ${settingVal}\n${labels[1]}: ${timeVal}\n${labels[2]}: ${styleVal}\n${labels[3]}: ${charStr}\n${labels[11]}: ${moodWithEating}\n${labels[4]}: \n${outfitStr}\n${labels[5]}: ${foodStr}\n${labels[6]}: ${cameraVal}\n${labels[7]}: ${lightVal}\n${labels[8]}: ${soundVal}`;

          if (isCommerceMode && productName) {
            const productDesc = {
              vi: `Sản phẩm "${productName}" được đặt nổi bật trên bàn, thiết kế và màu sắc chính xác tuyệt đối theo khuôn mẫu ảnh tham chiếu.`,
              en: `Product "${productName}" is placed prominently on the table, exact design and colors perfectly matching the reference image.`,
              zh: `产品 "${productName}" 醒目放在桌子上，设计和颜色完全按照参考图像。`
            }[langKey];
            finalPrompt += `\n${labels[10]}: ${productDesc}`;
          }

          finalPrompt += `\n\n${timelineContent}\n\n${labels[9]}: ${noTextNote}`;

          if (isCommerceMode && productName) {
            const commerceNote = {
              vi: ` QUAN TRỌNG: Giữ nguyên thiết kế và chi tiết của sản phẩm "${productName}" ở mọi frame hình đúng y hệt kiểu dáng và màu sắc gốc.`,
              en: ` IMPORTANT: Keep the design and details of the product "${productName}" highly consistent in all frames exactly as the original style and color.`,
              zh: ` 重要提示：在所有画面中保持产品 “${productName}” 的设计和细节与原始款式和颜色完全一致。`
            }[langKey];
            finalPrompt += commerceNote;
          }

          return finalPrompt;
        };

        promptList.push({
          id: sessionSeed + i,
          index: i + 1,
          vi: createPromptForLang('vi'),
          en: createPromptForLang('en'),
          zh: createPromptForLang('zh')
        });
      }

      setGeneratedPrompts(promptList);
      setIsGenerating(false);
  };

  const copyToClipboard = (text: string, key: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 font-sans flex flex-col items-center">
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4 text-orange-500">
              <Key size={24} />
              <h2 className="text-xl font-black uppercase">Cấu hình API Key (AI)</h2>
            </div>
            <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
              Vui lòng nhập danh sách API Key của Google Gemini để sử dụng tính năng tạo và dịch tự động. 
              Mỗi API Key nằm trên 1 dòng. Hệ thống sẽ tự động dùng luân phiên nếu có key bị lỗi hoặc hết hạn.
            </p>
            <textarea
              value={tempApiKeysInput}
              onChange={(e) => setTempApiKeysInput(e.target.value)}
              placeholder={`AIzaSy...\nAIzaSy...\nAIzaSy...`}
              className="w-full h-32 bg-black border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-300 mb-4 focus:outline-none focus:border-orange-600 transition-colors"
            ></textarea>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSaveApiKeys}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold text-white hover:opacity-90 active:scale-95 transition-all"
              >
                Lưu Danh Sách API Key
              </button>
              <a 
                href="https://aistudio.google.com/api-keys" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-center text-blue-400 hover:text-blue-300 underline underline-offset-2 flex items-center justify-center gap-1"
              >
                <Link size={12} /> HD lấy API KEY MIỄN PHÍ : https://aistudio.google.com/api-keys
              </a>
              {apiKeys.length > 0 && (
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="w-full py-2 mt-2 bg-neutral-800 rounded-xl font-semibold text-neutral-400 hover:text-white transition-colors"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-end max-w-2xl">
        <button 
          onClick={() => setShowApiKeyModal(true)}
          className="text-xs font-bold text-neutral-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
        >
          <Key size={12} /> Cấu hình API ({apiKeys.length} keys)
        </button>
      </div>

      <div className="w-full max-w-2xl mb-8 mt-4 text-center">
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 bg-clip-text text-transparent flex items-center justify-center gap-2 uppercase">
          <Utensils className="text-red-500" /> Nam Mukbang Pro
        </h1>
        <p className="text-neutral-400 mt-2 text-sm font-medium italic">"Mâm đồ ăn hoành tráng - Timeline logic từng Part"</p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {theme === 'Custom' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <input
              type="text"
              placeholder="Nhập món ăn tùy chọn..."
              value={customFood}
              onChange={(e) => setCustomFood(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-orange-600 transition-all font-medium mb-4 shadow-2xl"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-orange-400 text-[10px] font-black uppercase">
              <Users size={12} /> Thành viên
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map(num => (
                <button key={num} onClick={() => setNumCharacters(num)} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${numCharacters === num ? 'bg-orange-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-500'}`}>
                  {num} Người
                </button>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-purple-400 text-[10px] font-black uppercase">
              <Shirt size={12} /> Thời trang
            </div>
            <div className="flex gap-1">
              <button onClick={() => setOutfitMode('Cameo')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${outfitMode === 'Cameo' ? 'bg-purple-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-500'}`}>Cameo</button>
              <button onClick={() => setOutfitMode('Random')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${outfitMode === 'Random' ? 'bg-purple-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-500'}`}>Ngẫu nhiên</button>
            </div>
          </div>

          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 text-[10px] font-black uppercase">
              <MonitorPlay size={12} /> Bối cảnh
            </div>
            <div className="flex gap-1">
              <button onClick={() => setSettingMode('Cameo')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${settingMode === 'Cameo' ? 'bg-emerald-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-500'}`}>Cameo gốc</button>
              <button onClick={() => setSettingMode('Theme')} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${settingMode === 'Theme' ? 'bg-emerald-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-500'}`}>Tùy chọn</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-blue-400 text-[10px] font-black uppercase">
              <Clock size={12} /> Tổng thời gian (12s/part)
            </div>
            <div className="flex items-center justify-between bg-neutral-800 rounded-lg p-1">
              <button onClick={() => handleDurationChange('minus')} className="p-2 hover:text-white transition-colors"><ChevronDown size={16}/></button>
              <span className="font-black text-sm">{duration}s</span>
              <button onClick={() => handleDurationChange('plus')} className="p-2 hover:text-white transition-colors"><ChevronUp size={16}/></button>
            </div>
          </div>

          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-red-500 text-[10px] font-black uppercase">
              <Star size={12} /> Chủ đề
            </div>
            <select value={theme} onChange={(e) => handleThemeChange(e.target.value)} className="w-full bg-neutral-800 text-white p-2 rounded-lg border-none text-[10px] font-bold h-[34px] focus:ring-0">
              {themes.map(t => (
                <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-yellow-400 text-[10px] font-black uppercase">
              <Flame size={12} /> Cách ăn
            </div>
            <select value={eatingStyle} onChange={(e) => setEatingStyle(e.target.value)} className="w-full bg-neutral-800 text-white p-2 rounded-lg border-none text-[10px] font-bold h-[34px] focus:ring-0">
              {eatingStyles.map(es => (
                <option key={es.id} value={es.id}>{es.icon} {es.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 text-[10px] font-black uppercase">
              <Camera size={12} /> Kiểu máy quay
            </div>
            <select value={cameraStyle} onChange={(e) => setCameraStyle(e.target.value)} className="w-full bg-neutral-800 text-white p-2 rounded-lg border-none text-[10px] font-bold h-[34px] focus:ring-0">
              {cameraStyles.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800 shadow-lg col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-pink-400 text-[10px] font-black uppercase">
              <ShoppingBag size={12} /> Bán Hàng / Tài Trợ (Kèm Ảnh Tham Chiếu)
            </div>
            <button
              onClick={() => setIsCommerceMode(!isCommerceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isCommerceMode ? 'bg-pink-600' : 'bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isCommerceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {isCommerceMode && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
              <input
                type="text"
                placeholder="Nhập tên/mô tả sản phẩm (VD: Bia sâm panh X, Kem đánh răng Y...)"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-pink-500 transition-all text-sm"
              />
              <p className="text-[10px] text-neutral-500 mt-2 italic">
                * Chú ý: Đưa prompt xuất ra vào AI kèm theo ảnh tham chiếu của sản phẩm này.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={generatePrompts}
          disabled={isGenerating || (theme === 'Custom' && !customFood)}
          className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-black text-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.95] disabled:opacity-50"
        >
          {isGenerating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : <><Zap size={22} fill="currentColor" /> XUẤT CHUỖI PROMPT MUKBANG</>}
        </button>

        {generatedPrompts && (
          <div className="space-y-10 mt-8 pb-20">
            {generatedPrompts.map((prompt, pIdx) => (
              <div key={prompt.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] font-black text-neutral-400">
                      {pIdx % 3 === 0 ? 'BẮT ĐẦU ĂN' : pIdx % 3 === 1 ? 'ĐANG ĂN NGON' : 'THƯỞNG THỨC & UỐNG'}
                   </div>
                   <div className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                     Video Part {prompt.index}
                   </div>
                </div>

                <div className="space-y-4">
                  {[
                    { lang: 'vi', label: 'TIẾNG VIỆT', content: prompt.vi, color: 'border-blue-500/20' },
                    { lang: 'en', label: 'ENGLISH', content: prompt.en, color: 'border-emerald-500/20' },
                    { lang: 'zh', label: 'CHINESE', content: prompt.zh, color: 'border-amber-500/20' }
                  ].map((item) => {
                    const uniqueKey = `${prompt.id}-${item.lang}`;
                    return (
                      <div key={item.lang} className={`bg-neutral-900/60 rounded-2xl border ${item.color} overflow-hidden`}>
                        <div className="bg-neutral-800/40 px-4 py-2 flex justify-between items-center">
                          <span className="text-[9px] font-black tracking-tighter text-neutral-400">{item.label}</span>
                          <button 
                            onClick={() => copyToClipboard(item.content, uniqueKey)}
                            className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md transition-all ${
                                copiedKey === uniqueKey ? 'text-green-500' : 'text-neutral-500 hover:text-white'
                            }`}
                          >
                            {copiedKey === uniqueKey ? <Check size={10} /> : <Copy size={10} />} {copiedKey === uniqueKey ? 'COPIED' : 'COPY'}
                          </button>
                        </div>
                        <div className="p-4">
                          <pre className="text-[11px] md:text-xs leading-relaxed text-neutral-300 whitespace-pre-wrap font-sans">
                            {item.content}
                          </pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
