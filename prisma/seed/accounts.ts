import { AccountCategory, type Prisma, PrismaClient, ReportType, TaxType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 複式簿記に準拠した勘定科目マスタデータ
 * コード体系:
 * 100番台=流動資産
 * 200番台=固定資産
 * 300番台=流動負債
 * 400番台=固定負債
 * 500番台=純資産
 * 600番台=収益
 * 700番台=費用
 */
const accountMasterData: Prisma.AccountCreateInput[] = [
    // ============================================
    // 資産（ASSET）- 貸借対照表（BS）
    // ============================================

    // 流動資産
    {
        code: '101',
        name: '現金',
        nameKana: 'げんきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 1,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '102',
        name: '普通預金',
        nameKana: 'ふつうよきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 2,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '103',
        name: '当座預金',
        nameKana: 'とうざよきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 3,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '104',
        name: '定期預金',
        nameKana: 'ていきよきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 4,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '111',
        name: '売掛金',
        nameKana: 'うりかけきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 11,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '112',
        name: '未収入金',
        nameKana: 'みしゅうにゅうきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 12,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '113',
        name: '前払金',
        nameKana: 'まえばらいきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 13,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '114',
        name: '立替金',
        nameKana: 'たてかえきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 14,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '115',
        name: '仮払金',
        nameKana: 'かりばらいきん',
        category: AccountCategory.ASSET,
        subCategory: '流動資産',
        reportType: ReportType.BS,
        displayOrder: 15,
        defaultTaxType: TaxType.NONE,
    },

    // 固定資産
    {
        code: '201',
        name: '建物',
        nameKana: 'たてもの',
        category: AccountCategory.ASSET,
        subCategory: '固定資産',
        reportType: ReportType.BS,
        displayOrder: 101,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '202',
        name: '備品',
        nameKana: 'びひん',
        category: AccountCategory.ASSET,
        subCategory: '固定資産',
        reportType: ReportType.BS,
        displayOrder: 102,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '203',
        name: '車両運搬具',
        nameKana: 'しゃりょううんぱんぐ',
        category: AccountCategory.ASSET,
        subCategory: '固定資産',
        reportType: ReportType.BS,
        displayOrder: 103,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '204',
        name: '土地',
        nameKana: 'とち',
        category: AccountCategory.ASSET,
        subCategory: '固定資産',
        reportType: ReportType.BS,
        displayOrder: 104,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '205',
        name: 'ソフトウェア',
        nameKana: 'そふとうぇあ',
        category: AccountCategory.ASSET,
        subCategory: '固定資産',
        reportType: ReportType.BS,
        displayOrder: 105,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '206',
        name: '機械装置',
        nameKana: 'きかいそうち',
        category: AccountCategory.ASSET,
        subCategory: '固定資産',
        reportType: ReportType.BS,
        displayOrder: 106,
        defaultTaxType: TaxType.NONE,
    },

    // ============================================
    // 負債（LIABILITY）- 貸借対照表（BS）
    // ============================================

    // 流動負債
    {
        code: '301',
        name: '買掛金',
        nameKana: 'かいかけきん',
        category: AccountCategory.LIABILITY,
        subCategory: '流動負債',
        reportType: ReportType.BS,
        displayOrder: 201,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '302',
        name: '未払金',
        nameKana: 'みばらいきん',
        category: AccountCategory.LIABILITY,
        subCategory: '流動負債',
        reportType: ReportType.BS,
        displayOrder: 202,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '303',
        name: '未払費用',
        nameKana: 'みばらいひよう',
        category: AccountCategory.LIABILITY,
        subCategory: '流動負債',
        reportType: ReportType.BS,
        displayOrder: 203,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '304',
        name: '預り金',
        nameKana: 'あずかりきん',
        category: AccountCategory.LIABILITY,
        subCategory: '流動負債',
        reportType: ReportType.BS,
        displayOrder: 204,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '305',
        name: '短期借入金',
        nameKana: 'たんきかりいれきん',
        category: AccountCategory.LIABILITY,
        subCategory: '流動負債',
        reportType: ReportType.BS,
        displayOrder: 205,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '306',
        name: '仮受金',
        nameKana: 'かりうけきん',
        category: AccountCategory.LIABILITY,
        subCategory: '流動負債',
        reportType: ReportType.BS,
        displayOrder: 206,
        defaultTaxType: TaxType.NONE,
    },

    // 固定負債
    {
        code: '401',
        name: '長期借入金',
        nameKana: 'ちょうきかりいれきん',
        category: AccountCategory.LIABILITY,
        subCategory: '固定負債',
        reportType: ReportType.BS,
        displayOrder: 301,
        defaultTaxType: TaxType.NONE,
    },

    // ============================================
    // 純資産（EQUITY）- 貸借対照表（BS）
    // ============================================
    {
        code: '501',
        name: '資本金',
        nameKana: 'しほんきん',
        category: AccountCategory.EQUITY,
        subCategory: '資本',
        reportType: ReportType.BS,
        displayOrder: 401,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '502',
        name: '元入金',
        nameKana: 'もといれきん',
        category: AccountCategory.EQUITY,
        subCategory: '資本',
        reportType: ReportType.BS,
        displayOrder: 402,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '503',
        name: '事業主借',
        nameKana: 'じぎょうぬしかり',
        category: AccountCategory.EQUITY,
        subCategory: '資本',
        reportType: ReportType.BS,
        displayOrder: 403,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '504',
        name: '事業主貸',
        nameKana: 'じぎょうぬしかし',
        category: AccountCategory.EQUITY,
        subCategory: '資本',
        reportType: ReportType.BS,
        displayOrder: 404,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },

    // ============================================
    // 収益（REVENUE）- 損益計算書（PL）
    // ============================================
    {
        code: '601',
        name: '売上高',
        nameKana: 'うりあげだか',
        category: AccountCategory.REVENUE,
        subCategory: '営業収益',
        reportType: ReportType.PL,
        displayOrder: 501,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '602',
        name: 'サービス売上高',
        nameKana: 'さーびすうりあげだか',
        category: AccountCategory.REVENUE,
        subCategory: '営業収益',
        reportType: ReportType.PL,
        displayOrder: 502,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '611',
        name: '受取利息',
        nameKana: 'うけとりりそく',
        category: AccountCategory.REVENUE,
        subCategory: '営業外収益',
        reportType: ReportType.PL,
        displayOrder: 511,
        isDisplay: true,
        defaultTaxType: TaxType.NON_TAXABLE,
    },
    {
        code: '612',
        name: '雑収入',
        nameKana: 'ざつしゅうにゅう',
        category: AccountCategory.REVENUE,
        subCategory: '営業外収益',
        reportType: ReportType.PL,
        displayOrder: 512,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },

    // ============================================
    // 費用（EXPENSE）- 損益計算書（PL）
    // ============================================
    {
        code: '701',
        name: '仕入高',
        nameKana: 'しいれだか',
        category: AccountCategory.EXPENSE,
        subCategory: '売上原価',
        reportType: ReportType.PL,
        displayOrder: 601,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '711',
        name: '給料賃金',
        nameKana: 'きゅうりょうちんぎん',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 611,
        defaultTaxType: TaxType.TAX_EXEMPT,
    },
    {
        code: '712',
        name: '法定福利費',
        nameKana: 'ほうていふくりひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 612,
        defaultTaxType: TaxType.TAX_EXEMPT,
    },
    {
        code: '713',
        name: '福利厚生費',
        nameKana: 'ふくりこうせいひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 613,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '714',
        name: '旅費交通費',
        nameKana: 'りょひこうつうひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 614,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '715',
        name: '通信費',
        nameKana: 'つうしんひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 615,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '716',
        name: '消耗品費',
        nameKana: 'しょうもうひんひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 616,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '717',
        name: '地代家賃',
        nameKana: 'ちだいやちん',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 617,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '718',
        name: '水道光熱費',
        nameKana: 'すいどうこうねつひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 618,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '719',
        name: '広告宣伝費',
        nameKana: 'こうこくせんでんひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 619,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '720',
        name: '交際費',
        nameKana: 'こうさいひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 620,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '721',
        name: '支払利息',
        nameKana: 'しはらいりそく',
        category: AccountCategory.EXPENSE,
        subCategory: '営業外費用',
        reportType: ReportType.PL,
        displayOrder: 621,
        isDisplay: true,
        defaultTaxType: TaxType.NON_TAXABLE,
    },
    {
        code: '722',
        name: '雑費',
        nameKana: 'ざっぴ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 622,
        isDisplay: true,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '723',
        name: '租税公課',
        nameKana: 'そぜいこうか',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 623,
        isDisplay: true,
        defaultTaxType: TaxType.TAX_EXEMPT,
    },
    {
        code: '724',
        name: '減価償却費',
        nameKana: 'げんかしょうきゃくひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 624,
        isDisplay: true,
        defaultTaxType: TaxType.NONE,
    },
    {
        code: '725',
        name: '保険料',
        nameKana: 'ほけんりょう',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 625,
        isDisplay: true,
        defaultTaxType: TaxType.NON_TAXABLE,
    },
    {
        code: '726',
        name: '修繕費',
        nameKana: 'しゅうぜんひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 626,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '727',
        name: '外注費',
        nameKana: 'がいちゅうひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 627,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '728',
        name: '会議費',
        nameKana: 'かいぎひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 628,
        defaultTaxType: TaxType.TAXABLE_10,
    },
    {
        code: '729',
        name: '研修費',
        nameKana: 'けんしゅうひ',
        category: AccountCategory.EXPENSE,
        subCategory: '販売費及び一般管理費',
        reportType: ReportType.PL,
        displayOrder: 629,
        defaultTaxType: TaxType.TAXABLE_10,
    },
];

async function main(): Promise<void> {
    console.log('🌱 Start seeding account master data...');

    // 既存のアカウントデータを削除（開発環境での再実行用）
    const deleteCount = await prisma.account.deleteMany({});
    console.log(`🗑️  Deleted ${deleteCount.count} existing account records`);

    // 勘定科目マスタデータを挿入
    let createdCount = 0;
    for (const account of accountMasterData) {
        await prisma.account.create({
            data: account,
        });
        createdCount++;
        console.log(
            `✅ [${account.code}] ${account.name} (${account.category} - ${account.subCategory})`
        );
    }

    console.log(`\n✨ Successfully seeded ${createdCount} account records`);

    // 統計情報を表示
    const stats = await prisma.account.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
        orderBy: {
            category: 'asc',
        },
    });

    console.log('\n📊 Account statistics by category:');
    for (const stat of stats) {
        console.log(`   ${stat.category}: ${stat._count.category} accounts`);
    }

    const total = await prisma.account.count();
    console.log(`\n📈 Total accounts in database: ${total}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
