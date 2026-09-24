export function maskIdCard(idCard: string): string {
  if (!idCard || idCard.length < 13) return idCard || '-';
  const clean = idCard.replace(/\D/g, '');
  if (clean.length !== 13) return idCard;
  // 1-2345-xxxxx-xx-x
  return `${clean[0]}-${clean.slice(1, 5)}-xxxxx-xx-${clean[12]}`;
}

export function formatFullIdCard(idCard: string): string {
  if (!idCard) return '-';
  const clean = idCard.replace(/\D/g, '');
  if (clean.length !== 13) return idCard;
  return `${clean[0]}-${clean.slice(1, 5)}-${clean.slice(5, 10)}-${clean.slice(10, 12)}-${clean[12]}`;
}

export function formatThaiDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export function getSmivBadge(level: 'เขียว' | 'เหลือง' | 'ส้ม' | 'แดง') {
  switch (level) {
    case 'เขียว':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'เขียว (ปกติ)',
        desc: 'ติดตามตามปกติ',
      };
    case 'เหลือง':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'เหลือง (เฝ้าระวัง)',
        desc: 'ควรติดตามใกล้ชิด',
      };
    case 'ส้ม':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        label: 'ส้ม (เสี่ยงสูง)',
        desc: 'มีความเสี่ยง ต้องวางแผนติดตาม',
      };
    case 'แดง':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        label: 'แดง (วิกฤต/เร่งด่วน)',
        desc: 'เร่งด่วน ต้องประเมินและจัดการทันที',
      };
  }
}

export function getAppointmentStatusBadge(status: string) {
  switch (status) {
    case 'มาตามนัด':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'มาตามนัด',
      };
    case 'นัดใกล้ถึง':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'นัดใกล้ถึง',
      };
    case 'ขาดนัดและอยู่ระหว่างติดตาม':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        label: 'ขาดนัดและอยู่ระหว่างติดตาม',
      };
    case 'ขาดนัดเร่งด่วน':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-600',
        label: 'ขาดนัดเร่งด่วน',
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: status,
      };
  }
}

export function getTreatmentStatusBadge(status: string) {
  switch (status) {
    case 'อยู่ระหว่างการบำบัด':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'ครบเกณฑ์':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    case 'ขาดนัด':
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    case 'เข้าสู่กระบวนการบำบัด':
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    case 'จำหน่าย':
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    case 'ส่งต่อ':
      return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'ไม่ประสงค์รับการบำบัด':
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
}

export function exportToCSV(filename: string, rows: Record<string, string | number | undefined>[]) {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    '\uFEFF' + // UTF-8 BOM for Thai Excel support
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            let cell = row[k] === null || row[k] === undefined ? '' : String(row[k]);
            cell = cell.replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * คำนวณปีงบประมาณ พ.ศ. ปัจจุบันตามระเบียบราชการไทย
 * (ปีงบประมาณไทย เริ่ม 1 ตุลาคมของปีก่อนหน้า จนถึง 30 กันยายนของปีนั้นๆ)
 * ตัวอย่าง: 1 ต.ค. 2568 - 30 ก.ย. 2569 คือ ปีงบประมาณ 2569
 *           1 ต.ค. 2569 - 30 ก.ย. 2570 คือ ปีงบประมาณ 2570
 */
export function getCurrentFiscalYear(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = ม.ค. ... 9 = ต.ค., 11 = ธ.ค.
  return year + 543 + (month >= 9 ? 1 : 0);
}

/**
 * คำนวณปีงบประมาณจากวันที่ (YYYY-MM-DD หรือ Date)
 */
export function getFiscalYearFromDate(dateInput?: string | Date): string {
  if (!dateInput) return String(getCurrentFiscalYear());
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(getCurrentFiscalYear());
    const year = d.getFullYear();
    const month = d.getMonth();
    return String(year + 543 + (month >= 9 ? 1 : 0));
  } catch {
    return String(getCurrentFiscalYear());
  }
}

/**
 * สร้างรายการปีงบประมาณที่พร้อมใช้งานในระบบ
 * เริ่มต้นตั้งแต่ปี 2566 ตามที่กำหนด (2566, 2567, 2568, 2569...)
 * และรันต่อๆ ไปในอนาคตโดยอัตโนมัติตามปีปัจจุบัน (+ เผื่อวางแผนล่วงหน้า 1 ปี)
 * พร้อมรวมปีงบประมาณที่มีอยู่ในข้อมูลจริงของผู้ป่วยด้วย
 * เรียงลำดับจากปีล่าสุดลงไปถึงปีเริ่มต้น (descending) หรือกลับกัน
 */
export function getAvailableFiscalYears(
  startYear = 2566,
  existingYears: (string | undefined)[] = [],
  descending = true
): string[] {
  const currentFiscal = getCurrentFiscalYear();
  
  // แปลงปีที่มีในฐานข้อมูล
  const parsedExisting = existingYears
    .filter((y): y is string => Boolean(y))
    .map((y) => parseInt(y, 10))
    .filter((n) => !isNaN(n));

  // ปีสูงสุด: อย่างน้อยต้องถึงปีงบปัจจุบัน + 1 (เผื่อการลงทะเบียน/วางแผนล่วงหน้า) หรืออย่างน้อย 2569
  const maxYear = Math.max(
    currentFiscal + 1,
    2569,
    ...parsedExisting
  );

  // ปีต่ำสุด: 2566 หรือต่ำกว่าหากมีประวัติเก่ากว่านั้น
  const minYear = Math.min(
    startYear,
    ...(parsedExisting.length > 0 ? parsedExisting : [startYear])
  );

  const years: string[] = [];
  if (descending) {
    for (let y = maxYear; y >= minYear; y--) {
      years.push(String(y));
    }
  } else {
    for (let y = minYear; y <= maxYear; y++) {
      years.push(String(y));
    }
  }

  return years;
}
