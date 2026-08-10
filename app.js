/* =====================================================================
   أذكاري – app.js   (Vanilla JavaScript, LocalStorage & ServiceWorker)
   ===================================================================== */

'use strict';

// ─────────────────────────────────────────────
//  DATA & ARRAYS
// ─────────────────────────────────────────────

const RECITERS = [
  { name: 'مشاري العفاسي', server: 'https://server8.mp3quran.net/afs/' },
  { name: 'عبد الباسط عبد الصمد', server: 'https://server7.mp3quran.net/basit/' },
  { name: 'سعد الغامدي', server: 'https://server7.mp3quran.net/sds/' },
  { name: 'ماهر المعيقلي', server: 'https://server12.mp3quran.net/maher/' },
  { name: 'محمود خليل الحصري', server: 'https://server13.mp3quran.net/hussary/' }
];

const AYAH_OF_DAY = [
  { text: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ', ref: 'سورة الطلاق: ٣' },
  { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٥﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٦﴾', ref: 'سورة الشرح: ٥-٦' },
  { text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', ref: 'سورة طه: ١١٤' },
  { text: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', ref: 'سورة الرعد: ٢٨' },
  { text: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ', ref: 'سورة البقرة: ٤٥' },
  { text: 'إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ', ref: 'سورة النحل: ١٢٨' },
  { text: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', ref: 'سورة الضحى: ٥' },
  { text: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', ref: 'سورة آل عمران: ١٧٣' },
  { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', ref: 'سورة البقرة: ٢٠١' },
  { text: 'إِنَّ مَعَ الصَّبْرِ نَصْرًا وَمَعَ الْكَرْبِ فَرَجًا', ref: 'حديث شريف' },
];

const WEEKLY_WIRDS = [
  { day: 0, name: 'الأحد', dhikr: 'يَا حَيُّ يَا قَيُّومُ', target: 100 },
  { day: 1, name: 'الإثنين', dhikr: 'يَا قَاضِيَ الْحَاجَاتِ', target: 100 },
  { day: 2, name: 'الثلاثاء', dhikr: 'يَا أَرْحَمَ الرَّاحِمِينَ', target: 100 },
  { day: 3, name: 'الأربعاء', dhikr: 'يَا حَيُّ يَا قَيُّومُ / يَا أَبَا صَالِحٍ أَدْرِكْنِي', target: 100 },
  { day: 4, name: 'الخميس', dhikr: 'لا إِلهَ إِلاَّ اللهُ المَلِكُ الحَقُّ المُبِينُ', target: 100 },
  { day: 5, name: 'الجمعة', dhikr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ وَعَجِّلْ فَرَجَهُمْ', target: 100 },
  { day: 6, name: 'السبت', dhikr: 'يَا رَبَّ الْعَالَمِينَ', target: 100 }
];

const KHATMAH_PLAN = [
  { day: 1,  juz: 1,  start: 'الفاتحة 1',   end: 'البقرة 141',   surahId: 1,  desc: 'الجزء 1: من سورة الفاتحة آية 1 إلى البقرة آية 141' },
  { day: 2,  juz: 2,  start: 'البقرة 142',  end: 'البقرة 252',   surahId: 2,  desc: 'الجزء 2: من سورة البقرة آية 142 إلى البقرة آية 252' },
  { day: 3,  juz: 3,  start: 'البقرة 253',  end: 'آل عمران 92', surahId: 2,  desc: 'الجزء 3: من سورة البقرة آية 253 إلى آل عمران آية 92' },
  { day: 4,  juz: 4,  start: 'آل عمران 93', end: 'النساء 23',    surahId: 3,  desc: 'الجزء 4: من سورة آل عمران آية 93 إلى النساء آية 23' },
  { day: 5,  juz: 5,  start: 'النساء 24',   end: 'النساء 147',   surahId: 4,  desc: 'الجزء 5: من سورة النساء آية 24 إلى النساء آية 147' },
  { day: 6,  juz: 6,  start: 'النساء 148',  end: 'المائدة 81',   surahId: 4,  desc: 'الجزء 6: من سورة النساء آية 148 إلى المائدة آية 81' },
  { day: 7,  juz: 7,  start: 'المائدة 82',  end: 'الأنعام 110',  surahId: 5,  desc: 'الجزء 7: من سورة المائدة آية 82 إلى الأنعام آية 110' },
  { day: 8,  juz: 8,  start: 'الأنعام 111', end: 'الأعراف 87',   surahId: 6,  desc: 'الجزء 8: من سورة الأنعام آية 111 إلى الأعراف آية 87' },
  { day: 9,  juz: 9,  start: 'الأعراف 88',  end: 'الأنفال 40',   surahId: 7,  desc: 'الجزء 9: من سورة الأعراف آية 88 إلى الأنفال آية 40' },
  { day: 10, juz: 10, start: 'الأنفال 41',  end: 'التوبة 92',    surahId: 8,  desc: 'الجزء 10: من سورة الأنفال آية 41 إلى التوبة آية 92' },
  { day: 11, juz: 11, start: 'التوبة 93',   end: 'هود 5',        surahId: 9,  desc: 'الجزء 11: من سورة التوبة آية 93 إلى هود آية 5' },
  { day: 12, juz: 12, start: 'هود 6',       end: 'يوسف 52',      surahId: 11, desc: 'الجزء 12: من سورة هود آية 6 إلى يوسف آية 52' },
  { day: 13, juz: 13, start: 'يوسف 53',     end: 'إبراهيم 52',   surahId: 12, desc: 'الجزء 13: من سورة يوسف آية 53 إلى إبراهيم آية 52' },
  { day: 14, juz: 14, start: 'الحجر 1',     end: 'النحل 128',    surahId: 15, desc: 'الجزء 14: من سورة الحجر آية 1 إلى النحل آية 128' },
  { day: 15, juz: 15, start: 'الإسراء 1',   end: 'الكهف 74',     surahId: 17, desc: 'الجزء 15: من سورة الإسراء آية 1 إلى الكهف آية 74' },
  { day: 16, juz: 16, start: 'الكهف 75',    end: 'طه 135',       surahId: 18, desc: 'الجزء 16: من سورة الكهف آية 75 إلى طه آية 135' },
  { day: 17, juz: 17, start: 'الأننبياء 1',  end: 'الحج 78',      surahId: 21, desc: 'الجزء 17: من سورة الأنبياء آية 1 إلى الحج آية 78' },
  { day: 18, juz: 18, start: 'المؤمنون 1',  end: 'الفرقان 20',   surahId: 23, desc: 'الجزء 18: من سورة المؤمنون آية 1 إلى الفرقان آية 20' },
  { day: 19, juz: 19, start: 'الفرقان 21',  end: 'النمل 55',     surahId: 25, desc: 'الجزء 19: من سورة الفرقان آية 21 إلى النمل آية 55' },
  { day: 20, juz: 20, start: 'النمل 56',    end: 'العنكبوت 45',  surahId: 27, desc: 'الجزء 20: من سورة النمل آية 56 إلى العنكبوت آية 45' },
  { day: 21, juz: 21, start: 'العنكبوت 46', end: 'الأحزاب 30',   surahId: 29, desc: 'الجزء 21: من سورة العنكبوت آية 46 إلى الأحزاب آية 30' },
  { day: 22, juz: 22, start: 'الأحزاب 31',  end: 'يس 27',        surahId: 33, desc: 'الجزء 22: من سورة الأحزاب آية 31 إلى يس آية 27' },
  { day: 23, juz: 23, start: 'يس 28',       end: 'الزمر 31',     surahId: 36, desc: 'الجزء 23: من سورة يس آية 28 إلى الزمر آية 31' },
  { day: 24, juz: 24, start: 'الزمر 32',    end: 'فصلت 46',      surahId: 39, desc: 'الجزء 24: من سورة الزمر آية 32 إلى فصلت آية 46' },
  { day: 25, juz: 25, start: 'فصلت 47',     end: 'الجاثية 37',   surahId: 41, desc: 'الجزء 25: من سورة فصلت آية 47 إلى الجاثية آية 37' },
  { day: 26, juz: 26, start: 'الأحقاف 1',   end: 'ق 45',         surahId: 46, desc: 'الجزء 26: من سورة الأحقاف آية 1 إلى ق آية 45' },
  { day: 27, juz: 27, start: 'الذاريات 1',  end: 'الحديد 29',    surahId: 51, desc: 'الجزء 27: من سورة الذاريات آية 1 إلى الحديد آية 29' },
  { day: 28, juz: 28, start: 'المجادلة 1',  end: 'التحريم 12',   surahId: 58, desc: 'الجزء 28: من سورة المجادلة آية 1 إلى التحريم آية 12' },
  { day: 29, juz: 29, start: 'الملك 1',     end: 'المرسلات 50',  surahId: 67, desc: 'الجزء 29: من سورة الملك آية 1 إلى المرسلات آية 50' },
  { day: 30, juz: 30, start: 'النبأ 1',     end: 'الناس 6',      surahId: 78, desc: 'الجزء 30: من سورة النبأ آية 1 إلى سورة الناس آية 6' }
];

const QURAN_SURAHS = [
  { id: 1, name: 'الفاتحة', verses: 7, type: 'مكية', juz: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾' },
  { id: 2, name: 'البقرة', verses: 286, type: 'مدنية', juz: 1, text: 'الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴿٢﴾ الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ ﴿٣﴾ وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ ﴿٤﴾ أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ ﴿٥﴾...' },
  { id: 3, name: 'آل عمران', verses: 200, type: 'مدنية', juz: 3, text: 'الم ﴿١﴾ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ﴿٢﴾ نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ وَأَنزَلَ التَّوْرَاةَ وَالْإِنجِيلَ ﴿٣﴾...' },
  { id: 4, name: 'النساء', verses: 176, type: 'مدنية', juz: 4, text: 'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ...' },
  { id: 5, name: 'المائدة', verses: 120, type: 'مدنية', juz: 6, text: 'يَا أَيُّهَا الَّذِينَ آمَنُوا أَوْفُوا بِالْعُقُودِ...' },
  { id: 6, name: 'الأنعام', verses: 165, type: 'مكية', juz: 7, text: 'الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ وَجَعَلَ الظُّلُمَاتِ وَالنُّورَ...' },
  { id: 7, name: 'الأعراف', verses: 206, type: 'مكية', juz: 8, text: 'المص ﴿١﴾ كِتَابٌ أُنزِلَ إِلَيْكَ فَلَا يَكُن فِي صَدْرِكَ حَرَجٌ مِّنْهُ...' },
  { id: 8, name: 'الأنفال', verses: 75, type: 'مدنية', juz: 9, text: 'يَسْأَلُونَكَ عَنِ الْأَنفَالِ ۖ قُلِ الْأَنفَالُ لِلَّهِ وَالرَّسُولِ...' },
  { id: 9, name: 'التوبة', verses: 129, type: 'مدنية', juz: 10, text: 'بَرَاءَةٌ مِّنَ اللَّهِ وَرَسُولِهِ إِلَى الَّذِينَ عَاهَدتُّم مِّنَ الْمُشْرِكِينَ...' },
  { id: 10, name: 'يونس', verses: 109, type: 'مكية', juz: 11, text: 'الر ۚ تِلْكَ آيَاتُ الْكِتَابِ الْحَكِيمِ...' },
  { id: 11, name: 'هود', verses: 123, type: 'مكية', juz: 11, text: 'الر ۚ كِتَابٌ أُحْكِمَتْ آيَاتُهُ ثُمَّ فُصِّلَتْ مِن لَّدُنْ حَكِيمٍ خَبِيرٍ...' },
  { id: 12, name: 'يوسف', verses: 111, type: 'مكية', juz: 12, text: 'الر ۚ تِلْكَ آيَاتُ الْكِتَابِ الْمُبِينِ ﴿١﴾ إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ ﴿٢﴾...' },
  { id: 13, name: 'الرعد', verses: 43, type: 'مدنية', juz: 13, text: 'المر ۚ تِلْكَ آيَاتُ الْكِتَابِ ۗ وَالَّذِي أُنزِلَ إِلَيْكَ مِن رَّبِّكَ الْحَقُّ...' },
  { id: 14, name: 'إبراهيم', verses: 52, type: 'مكية', juz: 13, text: 'الر ۚ كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ لِتُخْرِجَ النَّاسَ مِنَ الظُّلُمَاتِ إِلَى النُّورِ...' },
  { id: 15, name: 'الحجر', verses: 99, type: 'مكية', juz: 14, text: 'الر ۚ تِلْكَ آيَاتُ الْكِتَابِ وَقُرْآنٍ مُّبِينٍ...' },
  { id: 16, name: 'النحل', verses: 128, type: 'مكية', juz: 14, text: 'أَتَىٰ أَمْرُ اللَّهِ فَلَا تَسْتَعْجِلُوهُ ۚ سُبْحَانَهُ وَتَعَالَىٰ عَمَّا يُشْرِكُونَ...' },
  { id: 17, name: 'الإسراء', verses: 111, type: 'مكية', juz: 15, text: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى...' },
  { id: 18, name: 'الكهف', verses: 110, type: 'مكية', juz: 15, text: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ۜ...' },
  { id: 19, name: 'مريم', verses: 98, type: 'مكية', juz: 16, text: 'كهيعص ﴿١﴾ ذِكْرُ رَحْمَتِ رَبِّكَ عَبْدَهُ زَكَرِيَّا ﴿٢﴾...' },
  { id: 20, name: 'طه', verses: 135, type: 'مكية', juz: 16, text: 'طه ﴿١﴾ مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ ﴿٢﴾ إِلَّا تَذْكِرَةً لِّمَن يَخْشَىٰ ﴿٣﴾...' },
  { id: 21, name: 'الأنبياء', verses: 112, type: 'مكية', juz: 17, text: 'اقْتَرَبَ لِلنَّاسِ حِسَابُهُمْ وَهُمْ فِي غَفْلَةٍ مُّعْرِضُونَ ﴿١﴾...' },
  { id: 22, name: 'الحج', verses: 78, type: 'مدنية', juz: 17, text: 'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمْ ۚ إِنَّ زَلْزَلَةَ السَّاعَةِ شَيْءٌ عَظِيمٌ ﴿١﴾...' },
  { id: 23, name: 'المؤمنون', verses: 118, type: 'مكية', juz: 18, text: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ ﴿١﴾ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ ﴿٢﴾...' },
  { id: 24, name: 'النور', verses: 64, type: 'مدنية', juz: 18, text: 'سُورَةٌ أَنزَلْنَاهَا وَفَرَضْنَاهَا وَأَنزَلْنَا فِيهَا آيَاتٍ بَيِّنَاتٍ...' },
  { id: 25, name: 'الفرقان', verses: 77, type: 'مكية', juz: 18, text: 'تَبَارَكَ الَّذِي نَزَّلَ الْفُرْقَانَ عَلَىٰ عَبْدِهِ لِيَكُونَ لِلْعَالَمِينَ نَذِيرًا ﴿١﴾...' },
  { id: 26, name: 'الشعراء', verses: 227, type: 'مكية', juz: 19, text: 'طسم ﴿١﴾ تِلْكَ آيَاتُ الْكِتَابِ الْمُبِينِ ﴿٢﴾...' },
  { id: 27, name: 'النمل', verses: 93, type: 'مكية', juz: 19, text: 'طس ۚ تِلْكَ آيَاتُ الْقُرْآنِ وَكِتَابٍ مُّبِينٍ ﴿١﴾...' },
  { id: 28, name: 'القصص', verses: 88, type: 'مكية', juz: 20, text: 'طسم ﴿١﴾ تِلْكَ آيَاتُ الْكِتَابِ الْمُبِينِ ﴿٢﴾ نَتْلُو عَلَيْكَ مِن نَّبَإِ مُوسَىٰ وَفِرْعَوْنَ...' },
  { id: 29, name: 'العنكبوت', verses: 69, type: 'مكية', juz: 20, text: 'الم ﴿١﴾ أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ ﴿٢﴾...' },
  { id: 30, name: 'الروم', verses: 60, type: 'مكية', juz: 21, text: 'الم ﴿١﴾ غُلِبَتِ الرُّومُ ﴿٢﴾ فِي أَدْنَى الْأَرْضِ وَهُم مِّن بَعْدِ غَلَبِهِمْ سَيَغْلِبُونَ ﴿٣﴾...' },
  { id: 36, name: 'يس', verses: 83, type: 'مكية', juz: 22, text: 'يس ﴿١﴾ وَالْقُرْآنِ الْحَكِيمِ ﴿٢﴾ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ﴿٣﴾ عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ ﴿٤﴾ تَنزِيلَ الْعَزِيزِ الرَّحِيمِ ﴿٥﴾...' },
  { id: 55, name: 'الرحمن', verses: 78, type: 'مدنية', juz: 27, text: 'الرَّحْمَٰنُ ﴿١﴾ عَلَّمَ الْقُرْآنَ ﴿٢﴾ خَلَقَ الْإِنسَانَ ﴿٣﴾ عَلَّمَهُ الْبَيَانَ ﴿٤﴾ الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ ﴿٥﴾...' },
  { id: 56, name: 'الواقعة', verses: 96, type: 'مكية', juz: 27, text: 'إِذَا وَقَعَتِ الْوَاقِعَةُ ﴿١﴾ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ﴿٢﴾ خَافِضَةٌ رَّافِعَةٌ ﴿٣﴾...' },
  { id: 67, name: 'الملك', verses: 30, type: 'مكية', juz: 29, text: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿١﴾ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ...' },
  { id: 78, name: 'النبأ', verses: 40, type: 'مكية', juz: 30, text: 'عَمَّ يَتَسَاءَلُونَ ﴿١﴾ عَنِ النَّبَإِ الْعَظِيمِ ﴿٢﴾ الَّذِي هُمْ فِيهِ مُخْتَلِفُونَ ﴿٣﴾ كَلَّا سَيَعْلَمُونَ ﴿٤﴾...' },
  { id: 94, name: 'الشرح', verses: 8, type: 'مكية', juz: 30, text: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ﴿١﴾ وَوَضَعْنَا عَنكَ وِزْرَكَ ﴿٢﴾ الَّذِي أَنقَضَ ظَهْرَكَ ﴿٣﴾ وَرَفَعْنَا لَكَ ذِكْرَكَ ﴿٤﴾ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٥﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٦﴾ فَإِذَا فَرَغْتَ فَانصَبْ ﴿٧﴾ وَإِلَىٰ رَبِّكَ فَارْغَب ﴿٨﴾' },
  { id: 112, name: 'الإخلاص', verses: 4, type: 'مكية', juz: 30, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾' },
  { id: 113, name: 'الفلق', verses: 5, type: 'مكية', juz: 30, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾' },
  { id: 114, name: 'الناس', verses: 6, type: 'مكية', juz: 30, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾' }
];

const DUAAS = [
  { id: 'morning', icon: '🌅', category: 'أذكار الصباح', title: 'دعاء الصباح', study: false, text: `اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.` },
  { id: 'morning2', icon: '☀️', category: 'أذكار الصباح', title: 'دعاء الصباح (2) – سيد الاستغفار', study: false, text: `اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ.\nأَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.` },
  { id: 'evening', icon: '🌇', category: 'أذكار المساء', title: 'دعاء المساء', study: false, text: `اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.` },
  { id: 'evening2', icon: '🌆', category: 'أذكار المساء', title: 'دعاء المساء (2)', study: false, text: `اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ:\nأَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.` },
  { id: 'rizq', icon: '💰', category: 'الرزق والبركة', title: 'دعاء الرزق', study: false, text: `اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.` },
  { id: 'barakah', icon: '🌿', category: 'الرزق والبركة', title: 'دعاء البركة في الرزق', study: false, text: `اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا، وَقِنَا عَذَابَ النَّارِ.\nاللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقًا طَيِّبًا وَعِلْمًا نَافِعًا وَعَمَلًا مُتَقَبَّلًا.` },
  { id: 'study', icon: '🎓', category: 'التوفيق والدراسة', title: 'دعاء التوفيق في الدراسة', study: true, text: `رَبِّ زِدْنِي عِلْمًا، وَارْزُقْنِي فَهْمًا، وَاجْعَلْنِي مِنَ الصَّالِحِينَ.\nاللَّهُمَّ يَسِّرْ لِي أَمْرِي، وَاشْرَحْ لِي صَدْرِي، وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي.` },
  { id: 'focus', icon: '🧠', category: 'التركيز والحفظ', title: 'دعاء التركيز والحفظ', study: true, text: `اللَّهُمَّ افْتَحْ عَلَيَّ أَبْوَابَ رَحْمَتِكَ، وَانْشُرْ عَلَيَّ خَزَائِنَ عُلُومِكَ، وَارْزُقْنِي الْفَهْمَ وَالْحِفْظَ وَالتَّذَكُّرَ.\nوَاجْعَلْ لِسَانِي ذَاكِرًا لَكَ وَقَلْبِي خَاشِعًا لَكَ.` },
  { id: 'exam', icon: '📝', category: 'الامتحانات', title: 'دعاء قبل الامتحان', study: true, text: `اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا.\nاللَّهُمَّ ثَبِّتْ فِي قَلْبِي مَا تَعَلَّمْتُهُ، وَانْفَعْنِي بِمَا عَلَّمْتَنِي، وَزِدْنِي عِلْمًا.` },
  { id: 'success', icon: '🏆', category: 'النجاح والتوفيق', title: 'دعاء النجاح والتوفيق', study: true, text: `اللَّهُمَّ وَفِّقْنِي فِيمَا تُحِبُّهُ وَتَرْضَاهُ، وَاجْعَلْ سَعْيِي مَشْكُورًا وَعَمَلِي مَقْبُولًا.\nاللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا.` },
  { id: 'ambition', icon: '🌠', category: 'الهمة والعزيمة', title: 'دعاء رفع الهمة والعزيمة', study: true, text: `اللَّهُمَّ ارْزُقْنِي الْهِمَّةَ الْعَالِيَةَ، وَالْعَزِيمَةَ الصَّادِقَةَ، وَالصَّبْرَ عَلَى الطَّلَبِ.\nوَاجْعَلْنِي مِمَّنْ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ.` },
  { id: 'health', icon: '🛡️', category: 'الستر والصحة', title: 'دعاء الستر والصحة', study: false, text: `اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.` },
  { id: 'protection', icon: '🔒', category: 'الحماية والوقاية', title: 'دعاء الحفظ والوقاية', study: false, text: `بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.\nأَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.` },
  { id: 'anxiety', icon: '💙', category: 'الراحة والطمأنينة', title: 'دعاء الكرب والضيق', study: false, text: `اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ.\nأَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ:\nأَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي.` },
  { id: 'hasbi', icon: '⭐', category: 'التوكل على الله', title: 'دعاء حسبي الله', study: false, text: `حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.\n(تُقال سبع مرات صباحاً ومساءً)` },
  { id: 'parents', icon: '❤️', category: 'الوالدان', title: 'دعاء للوالدين', study: false, text: `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا.\nرَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ.` },
  { id: 'tawbah', icon: '🌸', category: 'التوبة والمغفرة', title: 'دعاء التوبة والمغفرة', study: false, text: `رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ.\nاللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي.` },
  { id: 'travel', icon: '🚗', category: 'السفر والتنقل', title: 'دعاء السفر والخروج', study: false, text: `بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ.\nاللَّهُمَّ إِنِّي أَسْأَلُكَ فِي سَفَرِي هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى.` },
  { id: 'shukr', icon: '🤍', category: 'الشكر والحمد', title: 'دعاء الشكر والحمد', study: false, text: `اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.\nالْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ.` },
  { id: 'sleep_duaa', icon: '🌙', category: 'قبل النوم', title: 'دعاء النوم', study: false, text: `اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا.\nاللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.\nاللَّهُمَّ اجْعَلْ نَوْمِي رَاحَةً وَيَقَظَتِي شُكْرًا.` },
  { id: 'worry', icon: '🕊️', category: 'الراحة والطمأنينة', title: 'دعاء الهم والحزن', study: false, text: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ،\nوَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.` },
  { id: 'enter_home', icon: '🏠', category: 'اليومي والعادات', title: 'دعاء دخول المنزل', study: false, text: `بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا.` }
];

const GREAT_DUAAS = [
  { id: 'ahad', icon: '✨', badge: 'دعاء العهد', title: 'دعاء العهد (المستحب صباحاً)', text: `اللّهُمَّ رَبَّ النُّورِ العَظيمِ، وَرَبَّ الكُرْسِيِّ الرَّفيعِ، وَرَبَّ البَحْرِ المَسْجورِ، وَمُنْزِلَ التَّوْراةِ وَالإِنْجيلِ وَالزَّبورِ...` },
  { id: 'faraj', icon: '🤲', badge: 'دعاء الفرج', title: 'دعاء الفرج (إلهي عظم البلاء)', text: `إِلهِي عَظُمَ البَلاءُ وَبَرِحَ الخَفاءُ وَانْكَشَفَ الغِطاءُ وَانْقَطَعَ الرَّجاءُ...` },
  { id: 'tawassul', icon: '🕊️', badge: 'دعاء التوسل', title: 'دعاء التوسل المبارك', text: `اللَّهُمَّ إِنِّي أَسْأَلُكَ وَأَتَوَجَّهُ إِلَيْكَ بِنَبِيِّكَ نَبِيِّ الرَّحْمَةِ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَآلِهِ...` },
  { id: 'kumayl', icon: '🌙', badge: 'دعاء كميل', title: 'دعاء كميل بن زياد', text: `اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ...` }
];

const SURAHS = [
  { id: 'sharh', name: 'سورة الشرح', number: '٩٤', canRepeat: true, text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nأَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ﴿١﴾ وَوَضَعْنَا عَنكَ وِزْرَكَ ﴿٢﴾ الَّذِي أَنقَضَ ظَهْرَكَ ﴿٣﴾ وَرَفَعْنَا لَكَ ذِكْرَكَ ﴿٤﴾ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٥﴾ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴿٦﴾ فَإِذَا فَرَغْتَ فَانصَبْ ﴿٧﴾ وَإِلَىٰ رَبِّكَ فَارْغَب ﴿٨﴾` },
  { id: 'ikhlas', name: 'سورة الإخلاص', number: '١١٢', canRepeat: true, text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾` },
  { id: 'falaq', name: 'سورة الفلق', number: '١١٣', canRepeat: false, text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾` },
  { id: 'nas', name: 'سورة الناس', number: '١١٤', canRepeat: false, text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾` }
];

const CHECKLIST_ITEMS = [
  { id: 'ck-subhan',       label: 'سبحان الله (33)',           icon: '📿' },
  { id: 'ck-hamd',         label: 'الحمد لله (33)',             icon: '📿' },
  { id: 'ck-akbar',        label: 'الله أكبر (34)',             icon: '📿' },
  { id: 'ck-ayah-kursi',   label: 'آية الكرسي بعد الصلاة',     icon: '🌟' },
  { id: 'ck-khatmah',      label: 'جُزْءُ الْخَتْمَةِ الشَّهْرِيَّةِ (اليوم)', icon: '📖' },
  { id: 'ck-morning',      label: 'دعاء الصباح',                icon: '🌅' },
  { id: 'ck-morning2',     label: 'سيد الاستغفار',               icon: '☀️' },
  { id: 'ck-evening',      label: 'دعاء المساء',                icon: '🌇' },
  { id: 'ck-rizq',         label: 'دعاء الرزق والبركة',         icon: '💰' },
  { id: 'ck-study',        label: 'دعاء التوفيق في الدراسة',    icon: '🎓' },
  { id: 'ck-exam',         label: 'دعاء الامتحان والتركيز',     icon: '📝' },
  { id: 'ck-wird',         label: 'وِرْدُ وَذِكْرُ الْيَوْمِ (100)',    icon: '📅' },
  { id: 'ck-ashura',       label: 'زيارة عاشوراء الكاملة',     icon: '🏴' },
  { id: 'ck-ahad',         label: 'دعاء العهد',                icon: '✨' },
  { id: 'ck-faraj',        label: 'دعاء الفرج',                icon: '🤲' },
  { id: 'ck-sharh',        label: 'سورة الشرح',                 icon: '📖' },
  { id: 'ck-ikhlas',       label: 'سورة الإخلاص',               icon: '📖' },
  { id: 'ck-falaq',        label: 'سورة الفلق',                 icon: '📖' },
  { id: 'ck-nas',          label: 'سورة الناس',                 icon: '📖' },
  { id: 'ck-sleep-kursi',  label: 'آية الكرسي قبل النوم',       icon: '🌙' },
  { id: 'ck-istighfar',    label: 'الاستغفار (100)',            icon: '✨' }
];

// ─────────────────────────────────────────────
//  STATE
// ─────────────────────────────────────────────

let state = {
  dhikr:        { subhan:0, hamd:0, akbar:0, istighfar:0, wird:0, lan:0, salam:0 },
  done:         {},
  repeat:       {},
  checklist:    {},
  date:         today(),
  streak:       0,
  points:       0,
  weekHistory:  {},
  pomSessions:  0,
  fontScale:    1,
  darkMode:     false,
  athanEnabled: true,
  currentReciter: 0,
  khatmahDay:   1,
  khatmahDone:  {},
  reminders:    { morning: '07:00', evening: '17:00', ziyarat: '20:00', sleep: '22:00' }
};

function today() {
  return new Date().toISOString().slice(0,10);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem('adhkar_state') || '{}');
    if (saved.date && saved.date !== today()) {
      state.dhikr        = { subhan:0, hamd:0, akbar:0, istighfar:0, wird:0, lan:0, salam:0 };
      state.done         = {};
      state.repeat       = {};
      state.checklist    = {};
      state.date         = today();
      state.streak       = saved.streak || 0;
      state.points       = saved.points || 0;
      state.weekHistory  = saved.weekHistory || {};
      state.pomSessions  = 0;
      state.fontScale    = saved.fontScale || 1;
      state.darkMode     = saved.darkMode || false;
      state.athanEnabled = saved.athanEnabled !== undefined ? saved.athanEnabled : true;
      state.currentReciter = saved.currentReciter || 0;
      state.khatmahDay   = saved.khatmahDay || 1;
      state.khatmahDone  = saved.khatmahDone || {};
      state.reminders    = saved.reminders || state.reminders;
    } else {
      Object.assign(state, saved);
      state.date = today();
    }
  } catch(e) { /* ignore */ }
}

function saveState() {
  localStorage.setItem('adhkar_state', JSON.stringify(state));
}

// ─────────────────────────────────────────────
//  RENDER FUNCTIONS
// ─────────────────────────────────────────────

function renderAll() {
  renderDuaaList();
  renderGreatDuaaList();
  renderSurahList();
  renderStudyDuaas();
  renderTodayWird();
  renderKhatmah();
  renderQuranIndex();
  renderChecklist();
  restoreDhikrUI();
  restoreDoneButtons();
  renderTrackerDate();
  renderAyahOfDay();
  renderWeekGrid();
  updateNavStreak();
  applyDarkMode();
  applyFontScale();
  updateAthanButtonUI();
  pomoUpdateUI();
}

/* --- Duaa Lists --- */
function renderDuaaList() {
  const container = document.getElementById('duaa-list');
  if (!container) return;
  container.innerHTML = '';
  DUAAS.forEach(d => {
    const card = document.createElement('div');
    card.className = 'duaa-card' + (d.study ? ' study-featured' : '');
    card.id = 'duaa-card-' + d.id;
    const isDone = !!state.done['duaa-' + d.id];
    card.innerHTML = `
      <div class="duaa-category"><span>${d.icon}</span> ${d.category}</div>
      <div class="duaa-title">${d.title}</div>
      <div class="duaa-text">${d.text.replace(/\n/g,'<br/>')}</div>
      <div class="duaa-actions">
        <button class="btn-copy" onclick="copyText(this,'${d.title}')">📋 نسخ</button>
        <button class="btn-done ${isDone?'done':''}" onclick="markDone(this,'duaa-${d.id}')">
          ${isDone ? '✅ تمت القراءة' : '✅ تمت القراءة'}
        </button>
      </div>`;
    container.appendChild(card);
  });
}

function renderGreatDuaaList() {
  const container = document.getElementById('great-duaa-list');
  if (!container) return;
  container.innerHTML = '';
  GREAT_DUAAS.forEach(d => {
    const card = document.createElement('div');
    card.className = 'duaa-card';
    card.id = 'great-duaa-' + d.id;
    const isDone = !!state.done['great-duaa-' + d.id];
    card.innerHTML = `
      <div class="duaa-category"><span>${d.icon}</span> ${d.badge}</div>
      <div class="duaa-title">${d.title}</div>
      <div class="duaa-text">${d.text.replace(/\n/g,'<br/>')}</div>
      <div class="duaa-actions">
        <button class="btn-copy" onclick="copyText(this,'${d.title}')">📋 نسخ</button>
        <button class="btn-done ${isDone?'done':''}" onclick="markDone(this,'great-duaa-${d.id}')">
          ${isDone ? '✅ تمت القراءة' : '✅ تمت القراءة'}
        </button>
      </div>`;
    container.appendChild(card);
  });
}

function renderSurahList() {
  const container = document.getElementById('surah-list');
  if (!container) return;
  container.innerHTML = '';
  SURAHS.forEach(s => {
    const isDone   = !!state.done['surah-' + s.id];
    const repCount = state.repeat[s.id] || 0;
    const card = document.createElement('div');
    card.className = 'surah-card';
    card.id = 'surah-card-' + s.id;
    card.innerHTML = `
      <div class="surah-header">
        <div class="surah-name">${s.name}</div>
        <div class="surah-num">سورة رقم ${s.number}</div>
      </div>
      <div class="surah-text">${s.text.replace(/\n/g,'<br/>')}</div>
      <div class="surah-actions">
        <button class="btn-done ${isDone?'done':''}" onclick="markDone(this,'surah-${s.id}')">
          ${isDone ? '✅ تمت القراءة' : '✅ تمت القراءة'}
        </button>
        <button class="btn-copy" onclick="copyText(this,'${s.name}')">📋 نسخ</button>
        ${s.canRepeat ? `
        <button class="btn-repeat" onclick="repeatSurah('${s.id}',this)">🔁 تكرار</button>
        <span class="repeat-count" id="rep-${s.id}">${repCount > 0 ? repCount+'×' : ''}</span>
        ` : ''}
      </div>`;
    container.appendChild(card);
  });
}

/* --- Today's Wird --- */
function renderTodayWird() {
  const dayIndex = new Date().getDay();
  const wirdObj = WEEKLY_WIRDS.find(w => w.day === dayIndex) || WEEKLY_WIRDS[0];
  const titleEl = document.getElementById('wird-day-title');
  const textEl  = document.getElementById('wird-dhikr-text');
  const countEl = document.getElementById('count-wird');
  const progEl  = document.getElementById('prog-wird');
  if (titleEl) titleEl.textContent = 'وِرْدُ يَوْمِ ' + wirdObj.name;
  if (textEl) textEl.textContent = wirdObj.dhikr;
  const val = state.dhikr.wird || 0;
  if (countEl) countEl.textContent = val;
  if (progEl)  progEl.style.width = Math.min(100, (val / wirdObj.target) * 100) + '%';
}

function countWird() {
  const dayIndex = new Date().getDay();
  const wirdObj = WEEKLY_WIRDS.find(w => w.day === dayIndex) || WEEKLY_WIRDS[0];
  const val = (state.dhikr.wird || 0) + 1;
  if (val > wirdObj.target) return;
  state.dhikr.wird = val;
  saveState();
  const countEl = document.getElementById('count-wird');
  const progEl  = document.getElementById('prog-wird');
  if (countEl) {
    countEl.textContent = val;
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 120);
  }
  if (progEl) progEl.style.width = Math.min(100, (val / wirdObj.target) * 100) + '%';
  if (val >= wirdObj.target) {
    showToast('أحسنت! 🎉 اكتمل وِرْدُ يَوْمِ ' + wirdObj.name);
    state.checklist['ck-wird'] = true;
    saveState();
    renderChecklist();
    updateStreak();
  }
}

function resetWird() {
  state.dhikr.wird = 0;
  saveState();
  renderTodayWird();
}

/* --- Monthly Khatmah Tracker --- */
function renderKhatmah() {
  const grid = document.getElementById('khatmah-30grid');
  if (!grid) return;
  grid.innerHTML = '';
  const currentDay = state.khatmahDay || 1;
  const planItem = KHATMAH_PLAN.find(p => p.day === currentDay) || KHATMAH_PLAN[0];

  const titleEl = document.getElementById('khatmah-day-title');
  const descEl  = document.getElementById('khatmah-day-desc');
  const btnDone = document.getElementById('btn-khatmah-done');
  const pctEl   = document.getElementById('khatmah-pct');

  if (titleEl) titleEl.textContent = `اليوم ${currentDay} من 30 - الجزء ${planItem.juz}`;
  if (descEl)  descEl.textContent  = planItem.desc;

  const isDoneToday = !!state.khatmahDone[currentDay];
  if (btnDone) {
    if (isDoneToday) {
      btnDone.textContent = '✅ أكملت جزء اليوم مبارك لك';
      btnDone.classList.add('done');
    } else {
      btnDone.textContent = '✅ أكملت جزء اليوم (+100 نقطة)';
      btnDone.classList.remove('done');
    }
  }

  // 30 days grid
  let doneCount = 0;
  KHATMAH_PLAN.forEach(p => {
    const isDone = !!state.khatmahDone[p.day];
    if (isDone) doneCount++;
    const btn = document.createElement('button');
    btn.className = `khatmah-day-btn ${isDone ? 'done' : ''} ${p.day === currentDay ? 'active-day' : ''}`;
    btn.innerHTML = `<span>${p.day}</span>`;
    btn.title = p.desc;
    btn.onclick = () => selectKhatmahDay(p.day);
    grid.appendChild(btn);
  });

  const pct = Math.round((doneCount / 30) * 100);
  if (pctEl) pctEl.textContent = pct;
}

function selectKhatmahDay(dayNum) {
  state.khatmahDay = dayNum;
  saveState();
  renderKhatmah();
}

function openCurrentJuzReader() {
  const currentDay = state.khatmahDay || 1;
  const planItem = KHATMAH_PLAN.find(p => p.day === currentDay) || KHATMAH_PLAN[0];
  openQuranReader(planItem.surahId);
  showToast(`فُتحت السورة الخاصة بـ ${planItem.desc} 📖`);
}

function markKhatmahTodayDone() {
  const currentDay = state.khatmahDay || 1;
  if (state.khatmahDone[currentDay]) return;
  state.khatmahDone[currentDay] = true;
  state.points = (state.points || 0) + 100;
  state.checklist['ck-khatmah'] = true;
  if (currentDay < 30) state.khatmahDay = currentDay + 1;
  saveState();
  renderKhatmah();
  renderChecklist();
  updateStreak();
  showToast('تقبل الله! أكملت جزء الختمة لليوم (+100 نقطة) 🎉');
}

function resetKhatmahProgress() {
  if (!confirm('هل تريد إعادة الختمة القرآنية من اليوم الأول؟')) return;
  state.khatmahDone = {};
  state.khatmahDay = 1;
  state.checklist['ck-khatmah'] = false;
  saveState();
  renderKhatmah();
  renderChecklist();
  showToast('تمت إعادة الختمة القرآنية من جديد! تقبل الله طاعاتكم ✨');
}

/* --- Full Quran Index & Reader --- */
function renderQuranIndex(filter = '') {
  const grid = document.getElementById('quran-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = QURAN_SURAHS.filter(s => s.name.includes(filter) || String(s.id).includes(filter));
  filtered.forEach(s => {
    const card = document.createElement('div');
    card.className = 'quran-card';
    card.onclick = () => openQuranReader(s.id);
    card.innerHTML = `
      <div class="quran-surah-num">${s.id}</div>
      <div class="quran-surah-info">
        <div class="quran-surah-name">سورة ${s.name}</div>
        <div class="quran-surah-meta">${s.type} • ${s.verses} آية • الجزء ${s.juz}</div>
      </div>
      <div style="font-size:1.2rem; color:var(--primary);">📖</div>`;
    grid.appendChild(card);
  });
}

function filterQuranIndex(val) {
  renderQuranIndex(val.trim());
}

let activeSurahId = 1;
function openQuranReader(surahId) {
  activeSurahId = surahId;
  const surah = QURAN_SURAHS.find(s => s.id === surahId) || QURAN_SURAHS[0];
  const titleEl = document.getElementById('quran-modal-title');
  const bismEl  = document.getElementById('quran-modal-bismillah');
  const textEl  = document.getElementById('quran-modal-text');
  const reciterSelect = document.getElementById('reciter-select');

  if (titleEl) titleEl.textContent = `سورة ${surah.name} (${surah.verses} آية)`;
  if (bismEl)  bismEl.style.display = surah.id === 9 ? 'none' : 'block';
  if (textEl)  textEl.innerHTML = surah.text.replace(/\n/g, '<br/>');

  if (reciterSelect) reciterSelect.value = state.currentReciter || 0;
  loadSurahAudio(surah.id, state.currentReciter || 0);

  document.getElementById('quran-reader-overlay').classList.remove('hidden');
}

function loadSurahAudio(surahId, reciterIdx) {
  const reciter = RECITERS[reciterIdx] || RECITERS[0];
  const formattedId = String(surahId).padStart(3, '0');
  const audioEl = document.getElementById('quran-surah-audio');
  if (audioEl) {
    audioEl.src = `${reciter.server}${formattedId}.mp3`;
  }
}

function changeReciter(val) {
  state.currentReciter = parseInt(val, 10);
  saveState();
  loadSurahAudio(activeSurahId, state.currentReciter);
  const reciter = RECITERS[state.currentReciter];
  showToast(`تم اختيار القارئ: ${reciter.name} 🎙️`);
}

function pickRandomReciter() {
  const randIdx = Math.floor(Math.random() * RECITERS.length);
  const select = document.getElementById('reciter-select');
  if (select) select.value = randIdx;
  changeReciter(randIdx);
}

function closeQuranReader() {
  const audioEl = document.getElementById('quran-surah-audio');
  if (audioEl) { audioEl.pause(); }
  document.getElementById('quran-reader-overlay').classList.add('hidden');
}

/* --- Ziyarat Ashura Lan & Salam Counters --- */
function countLan() {
  const val = (state.dhikr.lan || 0) + 1;
  if (val > 100) return;
  state.dhikr.lan = val;
  saveState();
  const el = document.getElementById('count-lan');
  if (el) el.textContent = val + ' / 100';
  if (val >= 100) showToast('أحسنت! اكتمل قراءة اللعن 100 مرة ✨');
}

function countSalam() {
  const val = (state.dhikr.salam || 0) + 1;
  if (val > 100) return;
  state.dhikr.salam = val;
  saveState();
  const el = document.getElementById('count-salam');
  if (el) el.textContent = val + ' / 100';
  if (val >= 100) showToast('أحسنت! اكتمل قراءة السلام 100 مرة ✨');
}

/* --- Study Duaas --- */
function renderStudyDuaas() {
  const container = document.getElementById('study-duaa-list');
  if (!container) return;
  container.innerHTML = '';
  DUAAS.filter(d => d.study).forEach(d => {
    const card = document.createElement('div');
    card.className = 'duaa-card study-featured';
    card.innerHTML = `
      <div class="duaa-category"><span>${d.icon}</span> ${d.category}</div>
      <div class="duaa-title">${d.title}</div>
      <div class="duaa-text">${d.text.replace(/\n/g,'<br/>')}</div>
      <div class="duaa-actions">
        <button class="btn-copy" onclick="copyText(this,'${d.title}')">📋 نسخ</button>
      </div>`;
    container.appendChild(card);
  });
}

/* --- Checklist --- */
function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;
  container.innerHTML = '';
  CHECKLIST_ITEMS.forEach(item => {
    const isChecked = !!state.checklist[item.id];
    const div = document.createElement('div');
    div.className = 'checklist-item' + (isChecked ? ' checked' : '');
    div.id = 'cl-' + item.id;
    div.innerHTML = `
      <div class="checklist-checkbox" onclick="toggleChecklist('${item.id}')">
        ${isChecked ? '✓' : ''}
      </div>
      <span class="checklist-icon">${item.icon}</span>
      <span class="checklist-label">${item.label}</span>`;
    container.appendChild(div);
  });
  updateTrackerUI();
}

function renderTrackerDate() {
  const el = document.getElementById('tracker-date');
  if (!el) return;
  const d = new Date();
  const opts = { weekday:'long', year:'numeric', month:'long', day:'numeric' };
  el.textContent = d.toLocaleDateString('ar-SA', opts);
}

function restoreDhikrUI() {
  ['subhan','hamd','akbar','istighfar'].forEach(k => {
    const max = k === 'akbar' ? 34 : k === 'istighfar' ? 100 : 33;
    const val = state.dhikr[k] || 0;
    const countEl = document.getElementById('count-' + k);
    const progEl  = document.getElementById('prog-' + k);
    if (countEl) countEl.textContent = val;
    if (progEl)  progEl.style.width = Math.min(100, (val/max)*100) + '%';
    if (val >= max) markDhikrDone(k);
  });
  const elLan = document.getElementById('count-lan');
  const elSal = document.getElementById('count-salam');
  if (elLan) elLan.textContent = (state.dhikr.lan || 0) + ' / 100';
  if (elSal) elSal.textContent = (state.dhikr.salam || 0) + ' / 100';
}

function restoreDoneButtons() {
  Object.keys(state.done).forEach(key => {
    const btn = document.querySelector(`button[onclick*="'${key}'"]`);
    if (btn) {
      btn.classList.add('done');
      btn.textContent = '✅ تمت القراءة';
    }
  });
}

// ─────────────────────────────────────────────
//  DHIKR & MARK DONE LOGIC
// ─────────────────────────────────────────────

function countDhikr(key, max) {
  const val = (state.dhikr[key] || 0) + 1;
  if (val > max) return;
  state.dhikr[key] = val;
  saveState();

  const countEl = document.getElementById('count-' + key);
  const progEl  = document.getElementById('prog-' + key);
  if (countEl) {
    countEl.textContent = val;
    countEl.classList.add('bump');
    setTimeout(() => countEl.classList.remove('bump'), 120);
  }
  if (progEl) progEl.style.width = Math.min(100, (val/max)*100) + '%';

  if (val >= max) {
    markDhikrDone(key);
    showToast('أحسنت! 🎉 اكتملت ' + getLabelFor(key));
    autoCheckDhikr(key);
  }
}

function getLabelFor(k) {
  return { subhan:'التسبيح', hamd:'التحميد', akbar:'التكبير', istighfar:'الاستغفار' }[k] || k;
}

function autoCheckDhikr(key) {
  const map = { subhan:'ck-subhan', hamd:'ck-hamd', akbar:'ck-akbar', istighfar:'ck-istighfar' };
  if (map[key]) {
    state.checklist[map[key]] = true;
    saveState();
    renderChecklist();
    updateStreak();
  }
}

function markDhikrDone(key) {
  const card = document.getElementById('dhikr-' + key) || document.querySelector('.sleep-dhikr-card');
  if (card) card.classList.add('completed');
  const btn = document.querySelector(`button[onclick="countDhikr('${key}',${key==='akbar'?34:key==='istighfar'?100:33})"]`);
  if (btn) btn.disabled = true;
}

function resetDhikr(key) {
  state.dhikr[key] = 0;
  const max = key === 'akbar' ? 34 : key === 'istighfar' ? 100 : 33;
  saveState();
  const countEl = document.getElementById('count-' + key);
  const progEl  = document.getElementById('prog-' + key);
  if (countEl) countEl.textContent = 0;
  if (progEl)  progEl.style.width = '0%';
  const card = document.getElementById('dhikr-' + key);
  if (card) card.classList.remove('completed');
  const btn = document.querySelector(`button[onclick="countDhikr('${key}',${max})"]`);
  if (btn) btn.disabled = false;
}

function markDone(btn, key) {
  if (btn.classList.contains('done')) return;
  btn.classList.add('done');
  btn.textContent = '✅ تمت القراءة';
  state.done[key] = true;
  saveState();
  showToast('بارك الله فيك! ✨');

  const ckMap = {
    'ayah-kursi':       'ck-ayah-kursi',
    'sleep-kursi':      'ck-sleep-kursi',
    'sleep-baqarah':    'ck-sleep-baqara',
    'ziyarat-ashura':   'ck-ashura',
    'great-duaa-ahad':    'ck-ahad',
    'great-duaa-faraj':   'ck-faraj',
    'surah-sharh':      'ck-sharh',
    'surah-ikhlas':     'ck-ikhlas',
    'surah-falaq':      'ck-falaq',
    'surah-nas':        'ck-nas',
    'duaa-morning':     'ck-morning',
    'duaa-morning2':    'ck-morning2',
    'duaa-evening':     'ck-evening',
    'duaa-rizq':        'ck-rizq',
    'duaa-study':       'ck-study',
    'duaa-exam':        'ck-exam',
    'duaa-parents':     'ck-parents'
  };
  if (ckMap[key]) {
    state.checklist[ckMap[key]] = true;
    saveState();
    renderChecklist();
    updateStreak();
  }
}

function repeatSurah(id, btn) {
  state.repeat[id] = (state.repeat[id] || 0) + 1;
  saveState();
  const el = document.getElementById('rep-' + id);
  if (el) el.textContent = state.repeat[id] + '×';
  showToast('تبارك الله! قراءة رقم ' + state.repeat[id]);
}

function copyText(btn, label) {
  const card = btn.closest('.ayah-card, .duaa-card, .surah-card, .ziyarat-card');
  let textEl = null;
  if (card) textEl = card.querySelector('.ayah-text, .duaa-text, .surah-text, .ziyarat-text');
  const text = textEl ? textEl.innerText : label;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('تم النسخ 📋')).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showToast('تم النسخ 📋'); } catch(e) { showToast('تعذّر النسخ'); }
  document.body.removeChild(ta);
}

function toggleChecklist(itemId) {
  state.checklist[itemId] = !state.checklist[itemId];
  saveState();
  renderChecklist();
  updateStreak();
}

let confettiFired = false;
function updateTrackerUI() {
  const total = CHECKLIST_ITEMS.length;
  const done  = CHECKLIST_ITEMS.filter(i => !!state.checklist[i.id]).length;
  const pct   = total > 0 ? Math.round((done/total)*100) : 0;
  const circumference = 314;
  const offset = circumference - (circumference * pct / 100);

  const ring   = document.getElementById('tracker-ring');
  const pctEl  = document.getElementById('tracker-pct');
  const doneEl = document.getElementById('stat-done');
  const totEl  = document.getElementById('stat-total');

  if (ring)   ring.style.strokeDashoffset = offset;
  if (pctEl)  pctEl.textContent = pct + '%';
  if (doneEl) doneEl.textContent = done;
  if (totEl)  totEl.textContent  = total;

  if (pct === 100 && !confettiFired) {
    launchConfetti();
  }
}

// ─────────────────────────────────────────────
//  FEATURES: AYAH OF DAY, DARK MODE, FONT SIZE, ATHAN
// ─────────────────────────────────────────────

function renderAyahOfDay() {
  const idx = new Date().getDate() % AYAH_OF_DAY.length;
  const a = AYAH_OF_DAY[idx];
  const el = document.getElementById('ayah-day-text');
  const ref = document.getElementById('ayah-day-ref');
  if (el) el.textContent = a.text;
  if (ref) ref.textContent = '📖 ' + a.ref;
}

function toggleDark() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('dark', state.darkMode);
  const btn = document.getElementById('btn-dark');
  if (btn) { btn.textContent = state.darkMode ? '☀️' : '🌙'; btn.classList.toggle('dark-active', state.darkMode); }
  saveState();
}

function applyDarkMode() {
  if (state.darkMode) {
    document.body.classList.add('dark');
    const btn = document.getElementById('btn-dark');
    if (btn) { btn.textContent = '☀️'; btn.classList.add('dark-active'); }
  }
}

function changeFontSize(dir) {
  state.fontScale = Math.min(1.5, Math.max(0.8, (state.fontScale||1) + dir*0.1));
  document.documentElement.style.setProperty('--font-scale', state.fontScale);
  saveState();
}

function applyFontScale() {
  if (state.fontScale) document.documentElement.style.setProperty('--font-scale', state.fontScale);
}

function toggleAthanSound() {
  state.athanEnabled = !state.athanEnabled;
  saveState();
  updateAthanButtonUI();
  if (state.athanEnabled) {
    playAthanSound();
    showToast('تم تفعيل صوت الأذان عند حلول الوقت 📢');
  } else {
    showToast('تم إيقاف صوت الأذان 🔇');
  }
}

function updateAthanButtonUI() {
  const btn = document.getElementById('btn-athan');
  if (!btn) return;
  if (state.athanEnabled) {
    btn.textContent = '📢 الأذان: مفعّل';
    btn.classList.remove('muted');
  } else {
    btn.textContent = '🔇 الأذان: متوقف';
    btn.classList.add('muted');
  }
}

function playAthanSound() {
  const audio = document.getElementById('athan-audio');
  if (audio && state.athanEnabled) {
    audio.currentTime = 0;
    audio.play().catch(e => console.log('Audio autoplay restriction:', e));
  }
}

// ─────────────────────────────────────────────
//  PRAYER TIMES & ALARMS
// ─────────────────────────────────────────────

function loadPrayerTimes() {
  if (!navigator.geolocation) { calcPrayerTimes(21.3891, 39.8579); return; }
  navigator.geolocation.getCurrentPosition(
    p => calcPrayerTimes(p.coords.latitude, p.coords.longitude),
    () => calcPrayerTimes(21.3891, 39.8579)
  );
}

let prayerTimeStrings = {};
function calcPrayerTimes(lat, lng) {
  const now = new Date();
  const n = toJulian(now) - 2451545.0;
  const L = (280.460 + 0.9856474*n) % 360;
  const g = (357.528 + 0.9856003*n) % 360;
  const lambda = L + 1.915*Math.sin(g*Math.PI/180) + 0.020*Math.sin(2*g*Math.PI/180);
  const epsilon = 23.439 - 0.0000004*n;
  const sinDec = Math.sin(epsilon*Math.PI/180)*Math.sin(lambda*Math.PI/180);
  const dec = Math.asin(sinDec)*180/Math.PI;
  const RA = Math.atan2(Math.cos(epsilon*Math.PI/180)*Math.sin(lambda*Math.PI/180), Math.cos(lambda*Math.PI/180))*180/Math.PI;
  const EqT = L - RA;
  const noon = 12 - lng/15 - EqT/60 + (now.getTimezoneOffset()/-60);
  const latR = lat*Math.PI/180, decR = dec*Math.PI/180;
  function ha(angle) { return Math.acos((Math.sin(angle*Math.PI/180)-Math.sin(latR)*Math.sin(decR))/(Math.cos(latR)*Math.cos(decR)))*180/Math.PI/15; }
  const times = { fajr:noon-ha(-18), dhuhr:noon+0.017, asr:noon+Math.atan(1/(1+Math.tan(Math.abs(latR-decR))))*180/Math.PI/15, maghrib:noon+ha(-0.833), isha:noon+ha(-17) };
  const nowH = now.getHours()+now.getMinutes()/60;
  let nextKey=null, nextVal=99;
  Object.keys(times).forEach(k => {
    const t=times[k];
    const str = toTime(t);
    prayerTimeStrings[k] = str;
    const el=document.getElementById('pt-'+k);
    if(el) el.textContent=str;
    if(t>nowH && t<nextVal){nextVal=t;nextKey=k;}
  });
  if(!nextKey) nextKey='fajr';
  ['fajr','dhuhr','asr','maghrib','isha'].forEach(k => {
    const el=document.getElementById('pi-'+k);
    if(el) el.classList.toggle('next',k===nextKey);
  });
}

function toJulian(date) {
  const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
  const A=Math.floor(y/100),B=2-A+Math.floor(A/4);
  return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;
}

function toTime(h) {
  const hh=Math.floor(((h%24)+24)%24),mm=Math.floor((h-Math.floor(h))*60);
  return String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0');
}

// ─────────────────────────────────────────────
//  POMODORO
// ─────────────────────────────────────────────

let pomoTimer=null, pomoSeconds=25*60, pomoIsStudy=true, pomoRunning=false;
const POMO_STUDY=25*60, POMO_BREAK=5*60;

function pomoStart(){
  if(pomoRunning)return;
  pomoRunning=true;
  document.getElementById('pomo-start').style.display='none';
  document.getElementById('pomo-pause').style.display='inline-flex';
  pomoTimer=setInterval(pomoTick,1000);
}
function pomoPause(){
  pomoRunning=false;
  clearInterval(pomoTimer);
  document.getElementById('pomo-start').style.display='inline-flex';
  document.getElementById('pomo-pause').style.display='none';
}
function pomoReset(){
  pomoPause();
  pomoIsStudy=true;
  pomoSeconds=POMO_STUDY;
  pomoUpdateUI();
}
function pomoTick(){
  pomoSeconds--;
  if(pomoSeconds<=0){
    clearInterval(pomoTimer); pomoRunning=false;
    if(pomoIsStudy){
      state.pomSessions = (state.pomSessions||0) + 1;
      state.points = (state.points||0) + 10;
      saveState(); updateNavStreak();
      showToast('🎉 انتهت جلسة الدراسة! خذ استراحة مع الأذكار');
      pomoIsStudy=false; pomoSeconds=POMO_BREAK;
    } else {
      showToast('⏱️ انتهت الاستراحة! ابدأ جلسة جديدة');
      pomoIsStudy=true; pomoSeconds=POMO_STUDY;
    }
    document.getElementById('pomo-start').style.display='inline-flex';
    document.getElementById('pomo-pause').style.display='none';
  }
  pomoUpdateUI();
}
function pomoUpdateUI(){
  const m=Math.floor(pomoSeconds/60), s=pomoSeconds%60;
  const disp=document.getElementById('pomo-display'), ring=document.getElementById('pomo-ring'), mode=document.getElementById('pomo-mode'), lbl=document.getElementById('pomo-label'), sess=document.getElementById('pomo-sessions');
  if(disp) disp.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  if(lbl) lbl.textContent = pomoIsStudy ? 'دراسة' : 'استراحة';
  const total = pomoIsStudy ? POMO_STUDY : POMO_BREAK, pct = (total - pomoSeconds) / total;
  if(ring) ring.style.strokeDashoffset = 314 * (1 - pct);
  if(mode){
    mode.textContent = pomoIsStudy ? '🎓 وقت الدراسة' : '☕ وقت الاستراحة';
    mode.className = 'pomodoro-mode-label ' + (pomoIsStudy ? 'study-mode' : 'break-mode');
  }
  if(sess) sess.textContent = 'جلسات اليوم: ' + (state.pomSessions||0);
}

// ─────────────────────────────────────────────
//  STREAK & POINTS
// ─────────────────────────────────────────────

function updateStreak(){
  const t=today(), total=CHECKLIST_ITEMS.length, done=CHECKLIST_ITEMS.filter(i=>!!state.checklist[i.id]).length;
  if(!state.weekHistory) state.weekHistory={};
  const pct = total>0 ? done/total : 0;
  state.weekHistory[t] = pct;
  let streak=0, d=new Date();
  d.setDate(d.getDate()-1);
  while(true){
    const key = d.toISOString().slice(0,10);
    if((state.weekHistory[key]||0) >= 0.5){ streak++; d.setDate(d.getDate()-1); } else break;
    if(streak > 365) break;
  }
  if(pct >= 0.5) streak++;
  state.streak = streak;
  saveState();
  renderWeekGrid();
  updateNavStreak();
}

function renderWeekGrid(){
  const grid = document.getElementById('week-grid');
  if(!grid) return;
  const days = ['أحد','إثن','ثلث','أرب','خمس','جمع','سبت'], today_=new Date();
  grid.innerHTML = '';
  for(let i=6; i>=0; i--){
    const d = new Date(today_); d.setDate(d.getDate()-i);
    const key = d.toISOString().slice(0,10), pct = (state.weekHistory||{})[key]||0, isToday = key===today(), isDone = pct>=0.5, isPartial = pct>0 && pct<0.5;
    const dayEl = document.createElement('div'); dayEl.className='week-day';
    dayEl.innerHTML = `<div class="week-day-label">${days[d.getDay()]}</div><div class="week-day-dot ${isDone?'done':isPartial?'partial':''} ${isToday?'today':''}"> ${isDone?'✓':isPartial?'~':''}</div>`;
    grid.appendChild(dayEl);
  }
  const sd = document.getElementById('streak-days'), tp = document.getElementById('total-points');
  if(sd) sd.textContent = state.streak || 0;
  if(tp) tp.textContent = state.points || 0;
}

function updateNavStreak(){
  const el = document.getElementById('nav-streak');
  if(el) el.textContent = state.streak || 0;
}

function launchConfetti(){
  if(confettiFired) return;
  confettiFired = true;
  const colors = ['#10b981','#34d399','#fbbf24','#f59e0b','#6366f1','#fff'];
  for(let i=0; i<60; i++){
    const p = document.createElement('div'); p.className='confetti-piece';
    p.style.cssText = `left:${Math.random()*100}vw;background:${colors[Math.floor(Math.random()*colors.length)]};width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*0.5}s;`;
    document.body.appendChild(p); setTimeout(()=>p.remove(),4000);
  }
  state.points = (state.points||0) + 50;
  saveState();
  updateNavStreak();
  showToast('🎉 تقبل الله! أكملت وردك اليومي كاملاً! +50 نقطة');
}

// ─────────────────────────────────────────────
//  FULL-SCREEN TASBIH
// ─────────────────────────────────────────────

let tasbihCount=0, tasbihTarget=33, tasbihDhikrText='سُبْحَانَ اللَّهِ';
function openTasbih(){ tasbihCount=0; updateTasbihUI(); document.getElementById('tasbih-overlay').classList.remove('hidden'); }
function closeTasbih(){ document.getElementById('tasbih-overlay').classList.add('hidden'); }
function setTasbihDhikr(btn,text,target){
  tasbihDhikrText=text; tasbihTarget=target; tasbihCount=0;
  document.querySelectorAll('.tasbih-dhikr-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active'); updateTasbihUI();
}
function tapTasbih(){
  if(tasbihCount >= tasbihTarget) return;
  tasbihCount++;
  if(navigator.vibrate) navigator.vibrate(30);
  if(tasbihCount >= tasbihTarget) showToast('أحسنت! 🎉 اكتمل الذكر');
  updateTasbihUI();
}
function resetTasbih(){ tasbihCount=0; updateTasbihUI(); }
function updateTasbihUI(){
  const numEl=document.getElementById('tasbih-num'), dhEl=document.getElementById('tasbih-dhikr-text'), tEl=document.getElementById('tasbih-target-label'), pEl=document.getElementById('tasbih-progress-fill');
  if(numEl) numEl.textContent = tasbihCount;
  if(dhEl)  dhEl.textContent  = tasbihDhikrText;
  if(tEl)   tEl.textContent   = 'من ' + tasbihTarget;
  if(pEl)   pEl.style.width   = Math.min(100, tasbihCount/tasbihTarget*100) + '%';
}

// ─────────────────────────────────────────────
//  NOTIFICATIONS, REMINDERS & MANDATORY NOTICE
// ─────────────────────────────────────────────

function openReminderModal() {
  document.getElementById('reminder-overlay').classList.remove('hidden');
  const rem = state.reminders || {};
  if (rem.morning) document.getElementById('time-morning').value = rem.morning;
  if (rem.evening) document.getElementById('time-evening').value = rem.evening;
  if (rem.ziyarat) document.getElementById('time-ziyarat').value = rem.ziyarat;
  if (rem.sleep)   document.getElementById('time-sleep').value   = rem.sleep;
}

function closeReminderModal() {
  document.getElementById('reminder-overlay').classList.add('hidden');
}

function closeMandatoryNotice() {
  document.getElementById('mandatory-notice-overlay').classList.add('hidden');
}

function requestMandatoryNotification() {
  if ('Notification' in window) {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        showToast('تم تفعيل الإشعارات والأذان بنجاح 🔔');
      } else {
        showToast('تعذّر تفعيل الإشعارات، يرجى تفعيلها من إعدادات المتصفح');
      }
      closeMandatoryNotice();
    });
  } else {
    showToast('المتصفح لا يدعم الإشعارات');
    closeMandatoryNotice();
  }
}

function saveReminderTimes() {
  state.reminders = {
    morning: document.getElementById('time-morning').value,
    evening: document.getElementById('time-evening').value,
    ziyarat: document.getElementById('time-ziyarat').value,
    sleep:   document.getElementById('time-sleep').value
  };
  saveState();

  if ('Notification' in window) {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        showToast('تمت إضافة الإشعارات بنجاح 🔔');
      } else {
        showToast('يرجى تفعيل التذكيرات من إعدادات المتصفح');
      }
    });
  } else {
    showToast('تم حفظ الأوقات 🔔');
  }
  closeReminderModal();
}

function testNotification() {
  sendNotification('أذكاري 📿', 'تذكير تجريبي: حان وقت الأذان وقراءة الورد اليومي والختمة المباركة ✨');
  playAthanSound();
}

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ title, body });
      new Notification(title, { body, icon: '' });
    } else {
      new Notification(title, { body, icon: '' });
    }
  }
  showToast(body);
}

function checkScheduledReminders() {
  const now = new Date();
  const currentHM = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  const sec = now.getSeconds();
  if (sec > 5) return;

  const lastTrigger = localStorage.getItem('last_rem_trigger');
  if (lastTrigger === currentHM) return;

  // Check prayer times for Athan
  const namesAr = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
  for (const k of Object.keys(prayerTimeStrings)) {
    if (prayerTimeStrings[k] === currentHM) {
      sendNotification(`🕌 أذان صلاة ${namesAr[k]}`, `الله أكبر! حان الآن موعد صلاة ${namesAr[k]}`);
      playAthanSound();
      localStorage.setItem('last_rem_trigger', currentHM);
      return;
    }
  }

  // Check Wird & Khatmah custom reminders
  const rem = state.reminders || {};
  if (rem.morning === currentHM) {
    sendNotification('☀️ أذكار الصباح', 'صباح الخير! حان وقت أذكار الصباح وورد اليوم');
    localStorage.setItem('last_rem_trigger', currentHM);
  } else if (rem.evening === currentHM) {
    sendNotification('<ctrl42> أذكار المساء', 'مساء الخير! حان وقت أذكار المساء والتعقيبات');
    localStorage.setItem('last_rem_trigger', currentHM);
  } else if (rem.ziyarat === currentHM) {
    sendNotification('📖 الختمة الشهرية والزيارة', 'حان وقت قراءة جزء الختمة اليومية وزيارة عاشوراء');
    localStorage.setItem('last_rem_trigger', currentHM);
  } else if (rem.sleep === currentHM) {
    sendNotification('🌙 أذكار النوم', 'تصبح على خير! لا تنسَ أذكار النوم وآية الكرسي');
    localStorage.setItem('last_rem_trigger', currentHM);
  }
}

// ─────────────────────────────────────────────
//  NAVIGATION & APP INITIALIZATION
// ─────────────────────────────────────────────

function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-section').forEach(s => s.classList.toggle('active', s.id === 'tab-' + name));
}

function startDay() {
  document.getElementById('hero-section').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  window.scrollTo(0,0);
  showToast('مرحباً بك 🌿 بارك الله في يومك');

  if ('Notification' in window && Notification.permission !== 'granted') {
    setTimeout(() => {
      document.getElementById('mandatory-notice-overlay').classList.remove('hidden');
    }, 1000);
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let studyActive = false;
function toggleStudyMode() {
  studyActive = !studyActive;
  const overlay = document.getElementById('study-overlay');
  const btnNav  = document.getElementById('btn-study-nav');
  overlay.classList.toggle('hidden', !studyActive);
  if (btnNav) btnNav.classList.toggle('active', studyActive);
  if (studyActive) showToast('وضع الدراسة مفعّل 📚');
}

function resetDay() {
  if (!confirm('هل تريد بدء يوم جديد؟ سيتم مسح تقدم اليوم.')) return;
  state.dhikr     = { subhan:0, hamd:0, akbar:0, istighfar:0, wird:0, lan:0, salam:0 };
  state.done      = {};
  state.repeat    = {};
  state.checklist = {};
  state.date      = today();
  confettiFired   = false;
  saveState();
  renderAll();
  restoreDhikrUI();
  updateStreak();
  showToast('بداية يوم جديد مبارك 🌸');
}

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 3200);
}

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('SW registered:', reg.scope);
    }).catch(err => console.log('SW failed:', err));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  loadPrayerTimes();

  setInterval(checkScheduledReminders, 15000);

  // Close overlays on backdrop click
  document.getElementById('study-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('study-overlay')) toggleStudyMode();
  });
  document.getElementById('reminder-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('reminder-overlay')) closeReminderModal();
  });
  document.getElementById('quran-reader-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('quran-reader-overlay')) closeQuranReader();
  });
  document.getElementById('mandatory-notice-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('mandatory-notice-overlay')) closeMandatoryNotice();
  });
});
