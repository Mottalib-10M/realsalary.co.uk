/**
 * Variant prose content for salary landing pages.
 *
 * Each function returns alternate paragraph content for ~50% of pages
 * (determined by sectionVariation). This reduces cross-page similarity
 * between adjacent salary amounts that fall in the same lifeBracket.
 *
 * Returns null when the original inline template content should be used.
 * Returns string[] of HTML paragraphs when alternate content is selected.
 */

import { type CalculationResult } from './uk-tax-engine';
import { formatCurrency } from './format';
import { PERSONAL_ALLOWANCE, TAX_YEAR } from '../data/tax-rules-2026-27';

// ─── Variation helpers ───────────────────────────────────────────────────────

/**
 * Section-aware variation selector. Uses a different hash offset per section
 * so adjacent amounts (differing by £50) alternate variants independently
 * across different content sections.
 */
export function sectionVariation(amount: number, section: number, variants: number): number {
  const hash = ((amount * 3 + section * 13 + 3) * 7) % 997;
  return hash % variants;
}

function getLifeBracket(amount: number): string {
  if (amount <= 300) return 'minimal';
  if (amount <= 700) return 'parttime';
  if (amount <= 1050) return 'nearpa';
  if (amount <= 1800) return 'lower';
  return 'upper';
}

// ─── Daily Life Alternate Content ────────────────────────────────────────────

export function getDailyLifeAlt(amount: number, result: CalculationResult): string[] | null {
  if (sectionVariation(amount, 1, 2) === 0) return null;

  const annual = amount * 12;
  const netM = result.netAnnual / 12;
  const fA = formatCurrency(amount);
  const fAnn = formatCurrency(annual);
  const fNet = formatCurrency(netM);
  const fWeek = formatCurrency(result.netAnnual / 52);
  const fDay = formatCurrency(result.netAnnual / 365);
  const rent30 = formatCurrency(netM * 0.3);
  const ef3 = formatCurrency(netM * 3);
  const ef6 = formatCurrency(netM * 6);
  const mortMax = formatCurrency(annual * 4.5);
  const sav10 = formatCurrency(netM * 0.1);
  const fEffRate = result.effectiveTaxRate.toFixed(1) + '%';
  const bracket = getLifeBracket(amount);

  switch (bracket) {
    case 'minimal':
      return [
        `A monthly income of ${fA} adds up to ${fAnn} over a full year, which for most people represents occasional work or a few regular shifts rather than a primary career. Students, carers, and semi-retired individuals commonly earn in this range while balancing other priorities. The ${fNet} that reaches your account after any deductions represents real spending power, and understanding exactly what it can cover helps you plan your weeks and months with clarity rather than guesswork.`,

        `Stretching ${fA} across a full month means being intentional with every category of spending. Groceries for one person can be kept to £20 to £30 per week by shopping at Aldi, Lidl, or using supermarket yellow sticker reductions near closing time. If you share housing with family or a partner, your income covers personal expenses, a small contribution to household bills, and still leaves something for occasional treats. For those living independently, housing benefit or shared accommodation with family support is typically essential at this income level.`,

        `Getting around on ${fA} per month favours free options first: walking for anything under two miles and cycling for moderate distances. Many bus operators offer daily fare caps of £4 to £5, limiting your weekly travel costs to around £20 even with daily use. A SIM-only phone deal at £5 to £8 per month covers calls, texts, and basic data, while libraries offer free internet access for anything data-heavy. Keeping fixed costs minimal leaves more of your ${fNet} take home available for the things that matter to you.`,

        `The real value of earning ${fA} per month often extends beyond the money itself. Regular work builds habits, skills, and professional connections that open doors to higher-paying opportunities over time. Free online training through platforms like the Open University, Google Digital Garage, and government-funded Skills Bootcamps can accelerate your career development without requiring any financial investment. Many people who start at ${fA} per month move to significantly higher salaries within a year or two by combining reliable work experience with targeted skill building.`,
      ];

    case 'parttime':
      return [
        `Life on ${fA} per month shapes itself around part-time rhythms, with your ${fAnn} annual income supporting either a focused few days of work per week or shifts fitted around other responsibilities. After deductions, ${fNet} reaches your account each month, which breaks down to ${fWeek} per week or ${fDay} per day. These are the real figures that determine what you can afford for food, transport, and personal spending each week. For someone sharing housing costs with a partner or housemates, this income covers your contribution and leaves room for personal expenses.`,

        `Food shopping requires discipline at this income level. Planning meals for the full week before visiting the supermarket reduces impulse purchases and waste. Batch cooking on a quiet day produces five or six portions of a hearty meal like chilli, soup, or curry for under £10 in ingredients, giving you ready-made lunches and dinners throughout the week. A typical room in a shared house outside London costs between £300 and £550. Cities like Hull, Bradford, and Burnley offer some of the most affordable rents in the country, while university cities like Exeter and Bath tend toward the higher end.`,

        `Commuting costs need careful management when your income is ${fA} per month. If your workplace is within four miles, a bicycle eliminates transport costs entirely and improves your health at the same time. For longer journeys, many local authorities offer discounted travel for low-income residents. Your share of household bills in shared accommodation usually amounts to £40 to £70 per month covering energy, water, broadband, and your portion of council tax. Switching energy suppliers through a comparison site at least once a year can save £100 to £200 annually, even in a house share.`,

        `Career progression from ${fA} per month is a realistic goal with the right strategy. Free training through the National Careers Service, local college courses funded for adults, and employer-sponsored qualifications all provide pathways to higher-paid work. Care sector roles offer NVQ qualifications at no cost that lead directly to senior positions paying 30 to 50 percent more. The construction trades are another strong option: apprentice electricians, plumbers, and carpenters start near this salary but qualified tradespeople regularly earn £30,000 to £45,000 once their training is complete.`,
      ];

    case 'nearpa':
      return [
        `With ${fA} arriving each month, your annual income of ${fAnn} sits close to the Personal Allowance threshold of ${formatCurrency(PERSONAL_ALLOWANCE)}. This means the tax system treats your earnings favourably, with little or no income tax being deducted from your pay. Your take home of ${fNet} per month, or ${fWeek} per week, represents almost the full value of what you earn. For many people, this salary reflects the sweet spot of part-time professional work or full-time employment at entry level, where you earn enough to cover essential costs while keeping most of what you make.`,

        `Housing choices at ${fNet} per month depend heavily on geography. In affordable parts of the UK such as County Durham, Staffordshire, or the Welsh Valleys, this income covers a studio or small one-bedroom flat. In cities like Bradford, Stoke-on-Trent, and Middlesbrough, you can find a self-contained flat for £350 to £500. In larger cities such as Manchester or Leeds, a room in a shared house at £400 to £600 is the more realistic option. The gap between what ${rent30} buys in Sunderland versus what it buys in Brighton illustrates why geography is one of the most powerful financial levers available to people earning at this level.`,

        `Small financial decisions have a noticeable impact at ${fA} per month. Choosing a SIM-only phone deal instead of a contract saves £20 to £30 per month. Switching energy suppliers saves £100 to £200 per year. Using cashback apps and loyalty schemes on your regular grocery shop recovers £5 to £10 per month. These savings add up to over £500 per year, which at your income level makes a genuine difference to your quality of life. Council tax, utilities, and broadband form the backbone of your monthly fixed costs after housing, typically running between £200 and £350 combined depending on your area and living arrangements.`,

        `Roles that pay around ${fA} per month include warehouse operatives, nursery practitioners, fitness instructors, and junior kitchen staff. In the public sector, entry-level NHS Band 2 and Band 3 roles and school support staff commonly earn in this range on full-time contracts. The UK tax system recognises this income level by ensuring you pay no income tax below the ${formatCurrency(PERSONAL_ALLOWANCE)} annual threshold, letting you keep the maximum possible share of what you earn. If this income supports your lifestyle and goals, it represents a perfectly valid choice within the broader employment landscape.`,
      ];

    case 'lower':
      return [
        `A salary of ${fA} per month places you in the part of the income spectrum where genuine financial choices become available. Your annual income of ${fAnn} is taxed at the basic rate on everything above the Personal Allowance, but the effective rate of ${fEffRate} means the great majority of your earnings still reach your bank account. Your take home of ${fNet} per month, or ${fWeek} per week, supports a comfortable if modest standard of living across most of the United Kingdom. This is a proper working salary that millions of people across the country live on full time.`,

        `What ${rent30} per month buys in housing varies enormously by region. In Sheffield, Nottingham, or Swansea, this budget secures a comfortable one-bedroom flat in a decent area. In Bristol, Cambridge, or Edinburgh, you would more likely be looking at a room in a well-maintained shared house. In cities across the North East, the East Midlands, and Northern Ireland, ${rent30} commands a spacious property with room to spare. If you are considering buying rather than renting, mortgage lenders typically offer 4 to 4.5 times your annual salary, giving you a potential borrowing capacity of up to ${mortMax} before factoring in your deposit.`,

        `Your grocery budget can be more relaxed than at lower income levels. Weekly food spending of £45 to £65 allows for fresh vegetables, quality protein, and the occasional treat without constant price-watching. Eating out once or twice per month at an affordable restaurant fits comfortably into this budget. Transport becomes a question of preference rather than pure necessity, as running a modest car is feasible alongside public transport options. A gym membership, streaming services, and regular social activities all fit within a sensible budget at ${fA} per month without requiring sacrifice in other areas.`,

        `The key at this salary level is making deliberate choices about your priorities rather than feeling constrained across the board. Allocating £100 to £200 per month for leisure gives you room for hobbies, drinks with friends, and cultural outings such as cinema or a sporting event each month. Building an emergency fund of ${ef3} to ${ef6} is achievable within a year of focused saving, and once established it provides a meaningful safety net against unexpected costs. This is not luxury living, but it is a balanced life where you can enjoy yourself while still putting money aside for the future.`,
      ];

    case 'upper':
      return [
        `A salary of ${fA} per month gives you real financial breathing room. With ${fNet} landing in your account each month and an annual gross of ${fAnn}, you can plan with confidence rather than anxiety. This is the income level where genuine choices about lifestyle and future planning become available. Typical careers at this level include experienced public sector workers, qualified professionals, and mid-career specialists across a range of industries where skills and experience command a solid wage.`,

        `With ${rent30} allocated to housing following the 30% guideline, you can rent a well-maintained one or two bedroom flat in most UK cities outside central London. Leeds, Nottingham, and Glasgow offer particularly strong value at this price point, with quality properties in desirable areas well within budget. If you are considering the property ladder, mortgage lenders typically offer up to 4.5 times your annual salary, giving you a potential borrowing capacity of up to ${mortMax} before your deposit. Even in London, you can find a decent one-bedroom in Zones 3 to 5 at the ${rent30} level, though the best value often lies just outside the capital in commuter towns with fast rail links.`,

        `Food, transport, and utilities become manageable without constant monitoring at this salary level. A weekly grocery shop of £50 to £80 keeps the fridge stocked with quality ingredients, and there is room for dining out once or twice a week without guilt. Setting aside £100 to £200 per month allows for one or two holidays per year, whether a week on the Mediterranean, a city break elsewhere in the UK, or a longer trip if you plan well in advance. Weekend breaks across Europe are accessible from most UK airports with budget airline fares starting from £30 to £50 for short-haul flights.`,

        `What truly distinguishes this salary bracket is the ability to build genuine financial resilience. Saving ${sav10} per month (10% of your take home) grows to ${formatCurrency(netM * 0.1 * 12)} per year, and over five years accumulates to roughly ${formatCurrency(netM * 0.1 * 60)} before any investment returns. An emergency fund of ${ef3} to ${ef6}, covering three to six months of expenses, is achievable within one to two years of focused saving. Hobbies, gym memberships, personal development courses, and a full social calendar all fit comfortably within a sensible budget at ${fA} per month, making this a salary level where you can genuinely enjoy the present while building for the future.`,
      ];

    default:
      return null;
  }
}

// ─── Career Paths Alternate Content ──────────────────────────────────────────

export function getCareerAlt(amount: number, result: CalculationResult): string[] | null {
  if (sectionVariation(amount, 2, 2) === 0) return null;

  const annual = amount * 12;
  const fA = formatCurrency(amount);
  const fAnn = formatCurrency(annual);
  const bracket = getLifeBracket(amount);

  switch (bracket) {
    case 'minimal':
      return [
        `Roles that pay ${fA} per month typically involve a handful of hours each week. Common examples include weekend retail shifts, evening bar work, occasional cleaning contracts, and gig economy tasks such as food delivery or freelance writing. Many students take on these roles to fund their studies, and parents often choose minimal hours to work around school timetables. The flexibility these jobs offer is often as valuable as the pay itself, giving you control over when and how much you work.`,

        `Building from ${fA} per month toward higher earnings follows well-established paths. Hospitality and retail employers regularly offer extra shifts to dependable staff, making it possible to double your income without changing jobs. If you demonstrate consistent attendance and a willingness to take on varied tasks, managers tend to prioritise you when additional hours become available. The skills you develop, including time management, customer interaction, and working under pressure, transfer directly to better-paid positions.`,

        `If your current role pays ${fA} per month and you want to move toward full-time employment, focus on sectors with strong demand. Care work, logistics, and food production all face ongoing staff shortages across the UK and frequently hire people with no previous experience. These sectors offer structured training, clear progression pathways, and the stability of regular hours that casual work often lacks. Local Jobcentre Plus offices and the National Careers Service provide free support in identifying these opportunities.`,
      ];

    case 'parttime':
      return [
        `At ${fA} per month (${fAnn} per year), you are earning what many part-time roles pay for three to four working days per week. The jobs at this level span a wide range: classroom support assistants, care home staff on reduced hours, library workers, dental receptionists, pharmacy counter assistants, and administrative officers on part-time contracts. What these roles share is a defined set of responsibilities, regular shifts, and the opportunity to develop skills that translate to higher-paid positions over time.`,

        `The retail sector offers some of the most accessible opportunities at this salary level. Major chains such as Tesco, Sainsbury's, Boots, and M&S employ thousands of part-time workers across the UK. Starting pay is at or just above the National Living Wage, with internal promotion to supervisor or team leader roles adding £1 to £3 per hour. Seasonal peaks like Christmas and summer sales bring overtime opportunities that can significantly boost your monthly income for several weeks at a time.`,

        `For those looking to transition from ${fA} per month into higher-paying full-time work, vocational qualifications offer the most direct route. The health and social care sector provides funded NVQ courses that lead to senior care worker positions. The construction industry offers apprenticeships in plumbing, electrical installation, and carpentry with salaries that rise steeply once qualified. Administrative roles at this level build into office management, human resources, and finance positions with continued professional development.`,
      ];

    case 'nearpa':
      return [
        `A salary of ${fA} per month often indicates full-time work near the minimum wage or skilled work on a part-time basis. Common positions include delivery drivers, security officers, hairdressers, nursery staff, warehouse team members, and junior kitchen personnel. In the public sector, NHS Band 2 and Band 3 positions and local council support roles frequently pay in this range for full-time hours. Many of these jobs provide essential services and offer more stability than their pay level might suggest.`,

        `The skilled trades are well represented at ${fA} per month, particularly for apprentices and newly qualified workers. A first-year electrician, plumber, or gas engineer typically earns in this range during their training period. The investment in qualification pays off substantially: fully qualified tradespeople regularly earn £30,000 to £45,000 once certified. The UK faces a persistent shortage of skilled tradespeople, which means qualified workers enjoy strong job security and genuine leverage when negotiating their rates.`,

        `Contact centre and customer service roles frequently pay around ${fA} per month for full-time positions. While these jobs are sometimes viewed as temporary, they develop transferable skills in communication, conflict resolution, and working under performance targets that employers across many sectors value highly. Progression from front-line service into quality assurance, workforce planning, or team leadership is a well-established career path that can lift your salary by 30 to 50 percent within two to three years.`,
      ];

    case 'lower':
      return [
        `A monthly salary of ${fA} corresponds to roles where specific knowledge, qualifications, or several years of experience are expected. Typical positions include experienced administrative staff, NHS Band 4 and Band 5 workers, junior accountants, marketing coordinators, IT support analysts, police community support officers, and skilled manufacturing technicians. These are roles where employers are paying for your competence and reliability, and your salary reflects the value you bring to the organisation.`,

        `The public sector accounts for a significant share of employment at this salary level. NHS clinical support staff, social work assistants, local authority planning officers, and further education lecturers commonly earn between ${fA} and £2,000 per month. Public sector roles offer structured career progression through defined pay bands, employer pension contributions of 20 to 27 percent, generous annual leave entitlements, and access to professional development funding that adds substantial value beyond what your payslip shows.`,

        `Technology roles provide some of the strongest progression potential from this salary level. Junior web developers, IT helpdesk analysts, data processors, and digital marketing assistants typically start in this range. Within three to five years, many people who entered tech at ${fA} per month find themselves earning £30,000 to £40,000 as they gain proficiency with in-demand tools, platforms, and programming languages. The combination of growing demand for digital skills and the relative scarcity of qualified candidates creates upward pressure on salaries throughout the sector.`,
      ];

    case 'upper':
      return [
        `At ${fA} per month (${fAnn} per year), your salary places you among the established professional workforce of the United Kingdom. This is the income level where qualifications, accumulated expertise, and sector knowledge are clearly reflected in your pay. Common roles include mid-career teachers, qualified nurses at NHS Band 5 and 6, police constables, civil service higher executive officers, project coordinators, chartered accountants, software engineers, and experienced operations managers.`,

        `Two distinct career progression paths typically emerge from ${fA} per month. The management route involves taking responsibility for teams, budgets, and strategic decisions, developing your leadership capability through courses like CMI or ILM qualifications. The specialist route deepens your technical expertise in a specific domain, regulatory area, or industry niche until your knowledge commands a premium. Both paths can lead to salaries above £40,000 within a few years, and understanding which direction suits your aptitude helps focus your professional development effort.`,

        `Investment in professional development delivers measurable returns at this salary level. Qualifications such as ACCA, CIPD, PRINCE2, or sector-specific certifications typically add between £3,000 and £8,000 to annual salaries and unlock access to senior roles that require them. Many employers will fund or subsidise professional development for their staff, so raising the question with your line manager is always worthwhile. Continuing to build your skills and credentials is the single most reliable strategy for sustained salary growth beyond ${fA} per month.`,
      ];

    default:
      return null;
  }
}

// ─── Financial Planning Alternate Content ────────────────────────────────────

export function getFinancialPlanningAlt(amount: number, result: CalculationResult): string[] | null {
  if (sectionVariation(amount, 3, 2) === 0) return null;

  const annual = amount * 12;
  const netM = result.netAnnual / 12;
  const fA = formatCurrency(amount);
  const fAnn = formatCurrency(annual);
  const fNet = formatCurrency(netM);
  const ef3 = formatCurrency(netM * 3);
  const ef6 = formatCurrency(netM * 6);
  const mortMax = formatCurrency(annual * 4.5);
  const sav10 = formatCurrency(netM * 0.1);
  const bracket = getLifeBracket(amount);

  switch (bracket) {
    case 'minimal':
      return [
        `Financial planning on ${fA} per month begins with a clear picture of where your money goes. With ${fNet} coming in, even small untracked expenses can throw your budget off course. Writing down every purchase for a full month, however small, reveals patterns you might not expect. Many people discover that daily habits like buying a drink on the way to work or paying for parking add up to a meaningful share of their monthly income. This awareness is the foundation of better money management at any income level.`,

        `Building a savings habit at ${fA} per month is more important than the amount you save. Starting with £5 or £10 per month establishes the discipline of paying yourself first. Many banking apps now offer automatic round-up features that save the spare change from each transaction without you noticing. Over six months, these micro-savings can accumulate into a small but meaningful emergency buffer that prevents you from needing to borrow when something unexpected comes up.`,

        `Looking ahead from ${fA} per month, even modest investments in your skills or qualifications can shift your income trajectory. The UK government funds free courses for adults through the National Skills Fund, covering digital literacy, business management, and vocational skills. Local colleges offer part-time courses that fit around work schedules. These cost nothing but time and can lead to better-paid opportunities within months. The difference between staying at ${fA} and growing your income often comes down to whether you actively seek out these free development pathways.`,
      ];

    case 'parttime':
      return [
        `Managing finances on ${fA} per month requires separating essential spending from everything else. Start by listing your fixed monthly costs: housing contribution, council tax share, energy, phone, and transport. Subtract these from your ${fNet} take home and the remaining figure is what you have for food, personal items, and discretionary spending. Knowing this disposable income number precisely removes the anxiety of guessing and helps you avoid overdraft fees that would further reduce your effective income.`,

        `Debt management deserves focused attention at this salary level. If you carry balances on credit cards, overdrafts, or personal loans, the interest charges reduce your real income each month. Paying down the highest interest rate balance first saves the most money over time. If multiple debts feel unmanageable, free advice services such as StepChange, National Debtline, and Citizens Advice can negotiate with creditors on your behalf and create a realistic repayment plan based on what you can actually afford from your ${fNet} take home.`,

        `Your State Pension record matters even on ${fA} per month. If you earn above the Lower Earnings Limit of £6,708 per year, your employer reports your earnings to HMRC and the year counts toward your qualifying years. You need 35 qualifying years for the full State Pension of approximately £230 per week. Checking your National Insurance record online at gov.uk shows how many years you have already accumulated and flags any gaps that could reduce your future pension. Voluntary National Insurance contributions can fill gaps at relatively low cost.`,

        `Building an emergency fund on ${fA} per month is challenging but achievable with a specific target. Aim for an initial goal of £200 to £500, enough to cover a minor crisis such as a dental bill, a boiler repair contribution, or an unexpected travel cost. Setting up a standing order for £15 to £25 on payday makes this target reachable within one to two years. The psychological benefit of knowing you have this buffer is substantial, reducing financial stress and giving you more confidence to make career decisions from a position of stability rather than desperation.`,
      ];

    case 'nearpa':
      return [
        `At ${fA} per month, your financial planning can move beyond basic survival budgeting. With ${fNet} per month after deductions, you have enough income to create a proper budget with distinct categories for housing, food, transport, bills, savings, and personal spending. The 50/30/20 framework allocating 50 percent to needs, 30 percent to wants, and 20 percent to savings provides a useful starting point, though you may need to adjust the ratios depending on housing costs in your particular area.`,

        `Your workplace pension is one of the most valuable financial tools available to you at ${fA} per month. Under auto-enrolment rules, your employer contributes at least 3 percent of qualifying earnings while you contribute 5 percent. This means that for every £100 of qualifying earnings, your pension pot grows by £8 before any investment returns. If your employer offers to match contributions above the legal minimum, taking them up on it is effectively receiving free money and ranks among the best financial decisions you can make at any income level.`,

        `A Lifetime ISA deserves consideration if you are under 40 and saving for your first home. The government adds a 25 percent bonus to your contributions, up to £1,000 per year on a maximum of £4,000. That is a guaranteed 25 percent return before any interest is earned. Even contributing £50 to £100 per month from your ${fNet} take home generates a meaningful bonus over time. For general savings, a Cash ISA shelters your interest from tax, which becomes relevant once your savings exceed the Personal Savings Allowance.`,

        `Contents insurance is worth arranging even at ${fA} per month. Basic policies cost as little as £5 to £10 per month and protect your belongings against theft, fire, and water damage. Replacing a laptop, phone, and essential clothing after a burglary could cost £1,000 to £2,000, which would be devastating to recover from on this salary without cover. The small monthly premium buys peace of mind and prevents a single event from derailing months of careful financial management.`,
      ];

    case 'lower':
      return [
        `Financial planning on ${fA} per month transitions from managing scarcity to making strategic choices about where your money goes. Your take home of ${fNet} provides enough headroom to pursue multiple financial goals simultaneously. The most effective approach is automating your finances so that savings, pension top-ups, and bills leave your account on payday. Whatever remains after these automated transfers is genuinely available to spend freely, because your essential commitments and future goals are already covered.`,

        `An emergency fund of three to six months of essential expenses should be your first priority. At your spending level, this means accumulating between ${ef3} and ${ef6} in a readily accessible savings account. This fund acts as your personal insurance policy against job loss, illness, or unexpected major expenses. Without it, a single financial shock can force you into expensive borrowing that takes years to clear. With it, you handle most emergencies from a position of strength. Saving ${sav10} per month gets you to the three-month mark within about 30 months.`,

        `If buying a home is on your radar, understanding the numbers at ${fA} per month is essential. Mortgage lenders typically offer 4 to 4.5 times your annual gross salary, giving you potential borrowing capacity of up to ${mortMax}. Combined with a deposit, this determines the properties you can target. Government schemes including First Homes, shared ownership, and Help to Build can bridge the gap where property prices exceed what your salary alone supports. Starting your deposit savings early also demonstrates the financial discipline that mortgage assessors evaluate favourably.`,

        `Tax-efficient saving and investing deserve your attention at this income level. Your annual ISA allowance of £20,000 lets you shelter a meaningful amount of savings from tax. For basic-rate taxpayers, a stocks and shares ISA offers higher potential returns than cash over the long term, with all gains and dividends remaining completely tax-free. For pension savings, contributing above the auto-enrolment minimum through salary sacrifice simultaneously builds your retirement fund faster and reduces your income tax and National Insurance deductions, giving you more for less.`,
      ];

    case 'upper':
      return [
        `At ${fA} per month, your financial planning can incorporate strategies that are simply not practical at lower income levels. Your take home of ${fNet} per month supports a comfortable lifestyle while leaving genuine capacity for wealth building. The critical shift at this level is moving beyond merely saving money in a bank account to actively investing it, because cash held in a current account loses purchasing power to inflation every year. Making your surplus income generate returns is the most important financial behaviour to establish at this salary level.`,

        `Your pension deserves strategic attention. Every £80 you contribute to a pension effectively becomes £100 thanks to basic-rate tax relief, and if your employer matches contributions above the legal minimum, the returns multiply further. A practical approach is to increase your pension contribution by 1 percent each time you receive a pay rise. This gradual method builds a substantial retirement fund across your career without any noticeable impact on your current lifestyle, because you never adjust to spending the additional income.`,

        `Beyond your workplace pension and cash emergency fund, consider directing ${sav10} per month into a stocks and shares ISA invested in diversified global index funds. The long-term average return of global stock markets has historically been approximately 7 percent per year before inflation, significantly outpacing cash savings rates. A consistent monthly investment maintained over 20 years has the potential to grow into a substantial sum through the compounding effect, where returns generate their own returns year after year.`,

        `As your income and assets grow, estate planning and protection insurance become worthwhile considerations. A basic will costs between £150 and £300 through a solicitor and ensures your assets pass to the people you choose. Life insurance, if you have dependents, provides financial security for your family at a cost that is modest relative to the protection it delivers. Critical illness cover pays a lump sum if you are diagnosed with a specified serious condition, protecting your finances during recovery. At ${fA} per month, the premiums for these policies are affordable and form a responsible component of a comprehensive financial plan.`,
      ];

    default:
      return null;
  }
}

// ─── Inflation Context Alternate Content ─────────────────────────────────────

export function getInflationAlt(amount: number, result: CalculationResult): string[] | null {
  if (sectionVariation(amount, 4, 2) === 0) return null;

  const annual = amount * 12;
  const fA = formatCurrency(amount);
  const fAnn = formatCurrency(annual);
  const fNet = formatCurrency(result.netAnnual / 12);
  const fInflated10y = formatCurrency(amount * Math.pow(1.025, 10));

  return [
    `The purchasing power of ${fA} per month does not remain constant from one year to the next. Inflation steadily reduces what any given amount of money can buy. The UK experienced a period of elevated inflation between 2021 and 2024, with annual rates reaching above 10 percent before gradually returning to the Bank of England's 2 percent target. The cumulative effect means that ${fA} today buys noticeably less than the same amount did five years ago, and this erosion continues year after year even at moderate inflation rates.`,

    `For workers earning ${fA} per month in the ${TAX_YEAR} tax year, maintaining your real living standard requires annual pay increases that at least match the rate of inflation. Under normal economic conditions, this means securing raises of 2 to 3 percent per year. Without these increases, your take home of ${fNet} gradually buys less as prices rise around it. Over a full decade, even modest annual inflation of 2.5 percent compounds to a total erosion of roughly 22 percent. Your salary would need to rise from ${fA} to approximately ${fInflated10y} per month simply to maintain the same standard of living you have today.`,

    `This reality makes proactive career management one of the most important financial strategies available to you. Remaining in the same role at the same salary for several years almost always means losing ground in real terms, even when your payslip appears unchanged. Requesting annual pay reviews, developing new skills that command higher market rates, seeking internal promotions, and being willing to move employers when appropriate are all strategies that keep your income growing at or above the rate of inflation. At ${fA} per month, even small percentage increases translate directly into meaningful improvements in your day-to-day spending power.`,
  ];
}

// ─── Regional Comparison Alternate Content ───────────────────────────────────

export function getRegionalAlt(amount: number, result: CalculationResult): string[] | null {
  if (sectionVariation(amount, 5, 2) === 0) return null;

  const annual = amount * 12;
  const netM = result.netAnnual / 12;
  const fA = formatCurrency(amount);
  const fNet = formatCurrency(netM);
  const rent30 = formatCurrency(netM * 0.3);
  const regionBrk = amount <= 700 ? 'low' : amount <= 1500 ? 'mid' : 'high';

  switch (regionBrk) {
    case 'low':
      return [
        `The value of ${fA} per month depends almost entirely on where you live. Your take home of ${fNet} stretches furthest in regions where housing dominates less of your budget. The North East of England, parts of Yorkshire, and Northern Ireland consistently rank as the most affordable areas in the UK, with room rentals starting below £300 per month in smaller towns. Wales offers similar value, particularly in the Valleys and smaller coastal communities where a modest income covers the essentials with less pressure.`,

        `In contrast, the South East and Greater London present a completely different financial reality. Housing costs in these areas can consume your entire monthly salary of ${fA} before any other expenses are considered. If your work requires you to be near a high-cost area, remote or hybrid working arrangements can transform your finances by letting you earn a higher wage while living in a lower-cost region. Even jobs that were traditionally location-dependent, such as customer service and data processing, increasingly offer remote options that make geographic arbitrage a realistic strategy.`,
      ];

    case 'mid':
      return [
        `Your salary of ${fA} per month delivers its best value in the regions where housing costs are lowest. The North East, Yorkshire, the East Midlands, and the North West offer average one-bedroom flat rents of £400 to £550, leaving a meaningful share of your ${fNet} take home for all other expenses. Scotland provides particularly strong value in cities like Aberdeen, Inverness, and Perth, where rents remain well below Edinburgh and Glasgow levels while local job markets and amenities remain robust. Wales and Northern Ireland also deliver excellent purchasing power at this salary level.`,

        `London presents the starkest contrast. Average rents for a one-bedroom flat in the capital exceed £1,500, which is more than your entire gross monthly salary of ${fA}. Even outer London boroughs see studio rents starting around £800 per month. If your career connects you to London, satellite towns with fast commuter rail links offer a practical compromise. Places like Luton, Stevenage, Basildon, and Chatham provide significantly cheaper housing while keeping the capital within 30 to 45 minutes by train. The difference between what ${rent30} buys in Barnsley versus what it buys in Zone 2 London remains one of the most striking financial contrasts in the country.`,
      ];

    case 'high':
      return [
        `At ${fA} per month, your choice of UK region has a direct and measurable impact on your quality of life and ability to save. Cities across the Midlands and the North combine affordable living with thriving job markets. Birmingham, Manchester, Leeds, Sheffield, and Nottingham all offer strong economies and diverse employment opportunities at housing costs well below southern levels. A quality two-bedroom flat in Sheffield or Nottingham costs roughly half what a comparable property in Reading or Guildford would command, making your housing budget of ${rent30} go significantly further.`,

        `Scotland offers a compelling proposition for workers at ${fA} per month. While the Scottish income tax system applies slightly different rates, the difference in take-home pay is often modest for basic-rate taxpayers. Scotland compensates with several practical advantages including free NHS prescriptions, more generous student finance arrangements, and lower housing costs outside Edinburgh. Glasgow, Aberdeen, and Dundee maintain strong job markets with notably lower living costs than their English counterparts. If remote working gives you freedom to choose your base, the financial case for locating in Scotland or the North of England is strong at this salary level.`,
      ];

    default:
      return null;
  }
}

// ─── Budget Commentary Alternate Content ─────────────────────────────────────

export function getBudgetCommentaryAlt(amount: number, result: CalculationResult): string[] | null {
  if (sectionVariation(amount, 6, 2) === 0) return null;

  const annual = amount * 12;
  const netM = result.netAnnual / 12;
  const fA = formatCurrency(amount);
  const fNet = formatCurrency(netM);
  const bracket = getLifeBracket(amount);

  const housing = formatCurrency(netM * 0.30);
  const food = formatCurrency(netM * 0.12);
  const foodWeekly = formatCurrency(netM * 0.12 / 4.33);
  const transport = formatCurrency(netM * 0.10);
  const savings = formatCurrency(netM * 0.10);
  const savingsYearly = formatCurrency(netM * 0.10 * 12);
  const leisure = formatCurrency(netM * 0.08);
  const buffer = formatCurrency(netM * 0.10);

  switch (bracket) {
    case 'minimal':
    case 'parttime':
      return [
        `At ${fA} per month, the budget percentages above serve as a planning framework rather than a rigid prescription. The housing allocation of ${housing} falls well below the cheapest independent accommodation in most areas, which is why most people earning at this level share costs with family, a partner, or housemates. Treat the allocations as targets for whatever portion of your income goes toward personal expenses after your housing situation is accounted for separately.`,

        `The food allocation of ${food} per month works out to approximately ${foodWeekly} per week. This is tight for one person but achievable with deliberate planning: buying seasonal produce, cooking in batches, and shopping at discount supermarkets. Even setting aside half the suggested savings amount of ${savings} builds a useful emergency buffer over time. The most important step is creating the habit of saving something regularly, even if the amount feels small right now.`,
      ];

    case 'nearpa':
      return [
        `With a take home of ${fNet}, this budget becomes realistic for independent living in the more affordable parts of the UK. Your housing allocation of ${housing} covers a room in a shared house in most cities, or a studio flat in lower-cost areas such as the North East or Wales. The food budget of ${food} per month, equivalent to ${foodWeekly} per week, is enough for basic home cooking with fresh ingredients.`,

        `Your transport allocation of ${transport} covers a monthly bus pass in most areas or the running costs of maintaining a bicycle. The savings target of ${savings} per month builds to ${savingsYearly} over a full year, forming a meaningful emergency fund. The buffer of ${buffer} provides breathing room for months when an unexpected expense arises, from a dental bill to a replacement for an essential household item.`,
      ];

    case 'lower':
      return [
        `On your take home of ${fNet}, this budget provides a workable framework for genuinely comfortable living. The housing allocation of ${housing} covers a decent one-bedroom flat in most cities outside London and the South East. Your food budget of ${food} per month, equivalent to ${foodWeekly} per week, allows for varied meals with quality ingredients and the occasional takeaway. The leisure allocation of ${leisure} gives you real spending money for socialising, hobbies, and entertainment.`,

        `The savings target of ${savings} per month accumulates to ${savingsYearly} per year, enough to build a solid emergency fund and start working toward longer-term goals such as a house deposit, a holiday fund, or investment. Combined with the buffer of ${buffer}, you have a 20 percent cushion built into your budget for both planned savings and unexpected costs, which represents a strong position for financial stability at this income level.`,
      ];

    case 'upper':
      return [
        `Your take home of ${fNet} supports a genuinely comfortable budget where every category has breathing room. The housing allocation of ${housing} secures a good-quality one or two bedroom property in most UK cities. Your food budget of ${food} per month allows for quality groceries, regular dining out, and experimenting with new recipes without cost being a primary concern. The leisure allocation of ${leisure} supports a full social life including fitness memberships, entertainment subscriptions, and regular outings with friends or family.`,

        `Saving ${savings} per month grows to ${savingsYearly} over a year. Over five years of consistent saving at this rate, you accumulate roughly ${formatCurrency(netM * 0.10 * 60)} before any investment returns. If this money is invested through a stocks and shares ISA earning a long-term average of 7 percent annually, compound growth adds substantially to that figure. The combination of your 10 percent savings and 10 percent buffer means ${formatCurrency(netM * 0.20)} per month, or 20 percent of your take home, is working toward your financial security and future goals.`,
      ];

    default:
      return null;
  }
}

// ─── Salary Position Alternate Content ───────────────────────────────────────

export function getSalaryPositionAlt(amount: number, result: CalculationResult): string | null {
  if (sectionVariation(amount, 7, 2) === 0) return null;

  const annual = amount * 12;
  const fA = formatCurrency(amount);
  const fAnn = formatCurrency(annual);
  const pctMedian = Math.round((annual / 35000) * 100);

  if (annual < 15000) {
    return `At ${fAnn} per year, this income level is characteristic of part-time hours, casual shifts, or work that fits around other commitments such as studying or caregiving. Many people earning ${fA} per month work in sectors like retail, cleaning, food service, or delivery. At this level you may qualify for means-tested benefits such as Universal Credit or Housing Benefit to supplement your earnings, depending on your household circumstances.`;
  }
  if (annual < 22000) {
    return `An annual salary of ${fAnn} is typical of full-time entry-level positions, final-year apprenticeships, or professional part-time work. You will find this salary range across roles such as junior administration, retail supervision, classroom support, and entry-level customer service. In lower-cost areas of the UK this income provides a workable foundation, though in cities like London or Cambridge, careful budgeting and housing choices become essential.`;
  }
  if (annual < 30000) {
    return `Your ${fAnn} annual salary places you within the range occupied by many established full-time workers across the UK. Junior professionals, experienced tradespeople, NHS Band 3 to 5 staff, and skilled administrative roles commonly earn in this bracket. While below the national median, this income supports a reasonable standard of living in most regions outside London and the most expensive parts of the South East.`;
  }
  return `At ${fAnn} per year (${pctMedian}% of the national median), your salary sits ${annual >= 35000 ? 'at or above' : 'close to'} the midpoint for UK full-time workers. This level is characteristic of experienced professionals: NHS Band 5 and 6 staff, mid-career civil servants, experienced teachers, qualified accountants, and technical specialists. This income provides a comfortable standard of living in the majority of UK regions, with real capacity for both enjoying the present and saving for the future.`;
}
