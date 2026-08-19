from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    Flowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path("output/pdf/Ryan-Jewelers-Live-Marketing-Readiness-2026-08-17.pdf")
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4
GOLD = colors.HexColor("#C9A646")
GOLD_DARK = colors.HexColor("#9B7A25")
INK = colors.HexColor("#252525")
MUTED = colors.HexColor("#666666")
CREAM = colors.HexColor("#FAF7EF")
PALE_GOLD = colors.HexColor("#F4ECD5")
GREEN = colors.HexColor("#2F7D55")
PALE_GREEN = colors.HexColor("#EAF5EE")
RED = colors.HexColor("#A73B35")
PALE_RED = colors.HexColor("#FBEDEC")
AMBER = colors.HexColor("#9A6817")
PALE_AMBER = colors.HexColor("#FFF5DE")
RULE = colors.HexColor("#E4D9BE")


class ProgressBar(Flowable):
    def __init__(self, value, width=150 * mm, height=8 * mm):
        super().__init__()
        self.value = max(0, min(100, value))
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(colors.HexColor("#E9E3D6"))
        self.canv.roundRect(0, 0, self.width, self.height, self.height / 2, fill=1, stroke=0)
        self.canv.setFillColor(GOLD)
        self.canv.roundRect(0, 0, self.width * self.value / 100, self.height, self.height / 2, fill=1, stroke=0)


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="ReportTitle",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=24,
    leading=29,
    textColor=INK,
    alignment=TA_LEFT,
    spaceAfter=7 * mm,
))
styles.add(ParagraphStyle(
    name="Eyebrow",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10,
    textColor=GOLD_DARK,
    tracking=1.2,
    spaceAfter=3 * mm,
))
styles.add(ParagraphStyle(
    name="SectionTitle",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=17,
    leading=21,
    textColor=INK,
    spaceBefore=2 * mm,
    spaceAfter=5 * mm,
))
styles.add(ParagraphStyle(
    name="SubTitle",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=14,
    textColor=INK,
    spaceBefore=2 * mm,
    spaceAfter=2 * mm,
))
styles.add(ParagraphStyle(
    name="Body",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.2,
    leading=14,
    textColor=INK,
    spaceAfter=2.5 * mm,
))
styles.add(ParagraphStyle(
    name="Small",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=7.7,
    leading=11,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="CardTitle",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=9.5,
    leading=12,
    textColor=INK,
    spaceAfter=1.5 * mm,
))
styles.add(ParagraphStyle(
    name="CardBody",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.2,
    leading=12,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Status",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=10,
    alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="Source",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=7.2,
    leading=10,
    textColor=MUTED,
    spaceAfter=2 * mm,
))


def page_frame(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, PAGE_H - 5 * mm, PAGE_W, 5 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(RULE)
    canvas.line(18 * mm, 15 * mm, PAGE_W - 18 * mm, 15 * mm)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 10 * mm, "Ryan Jewelers - Live and Marketing Readiness")
    page_text = f"Page {doc.page}"
    canvas.drawRightString(PAGE_W - 18 * mm, 10 * mm, page_text)
    canvas.restoreState()


def pill(text, bg, fg):
    table = Table([[Paragraph(text, ParagraphStyle(
        name=f"pill-{text}", parent=styles["Status"], textColor=fg
    ))]], colWidths=[35 * mm], rowHeights=[8 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.5, fg),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
    ]))
    return table


def metric_card(label, value, note, bg=colors.white):
    data = [[
        Paragraph(label.upper(), styles["Eyebrow"]),
        Paragraph(value, ParagraphStyle(
            name=f"metric-{label}", parent=styles["CardTitle"], fontSize=20, leading=22, textColor=INK
        )),
    ], ["", Paragraph(note, styles["Small"])]]
    table = Table(data, colWidths=[47 * mm, 35 * mm], rowHeights=[12 * mm, 11 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.6, RULE),
        ("SPAN", (0, 0), (0, 1)),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
    ]))
    return table


def issue_card(priority, title, evidence, action, effort, critical=True):
    bg = PALE_RED if critical else PALE_AMBER
    fg = RED if critical else AMBER
    badge = Paragraph(priority, ParagraphStyle(
        name=f"priority-{priority}-{title}", parent=styles["Status"], textColor=fg
    ))
    content = [
        Paragraph(title, styles["CardTitle"]),
        Paragraph(f"<b>Evidence:</b> {evidence}", styles["CardBody"]),
        Paragraph(f"<b>Required:</b> {action}", styles["CardBody"]),
        Paragraph(f"<b>Estimated hands-on time:</b> {effort}", styles["CardBody"]),
    ]
    inner = Table([[item] for item in content], colWidths=[139 * mm])
    inner.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0.4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0.4 * mm),
    ]))
    table = Table([[badge, inner]], colWidths=[20 * mm, 143 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.6, fg),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (0, 0), 3 * mm),
        ("RIGHTPADDING", (0, 0), (0, 0), 3 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
        ("LINEAFTER", (0, 0), (0, 0), 0.5, fg),
    ]))
    return KeepTogether([table, Spacer(1, 3 * mm)])


def check_row(status, item, evidence):
    if status == "PASS":
        bg, fg = PALE_GREEN, GREEN
    elif status == "PARTIAL":
        bg, fg = PALE_AMBER, AMBER
    else:
        bg, fg = PALE_RED, RED
    return [pill(status, bg, fg), Paragraph(item, styles["CardTitle"]), Paragraph(evidence, styles["CardBody"])]


def timeline_row(day, focus, work):
    day_box = Table([[Paragraph(day, ParagraphStyle(
        name=f"day-{day}", parent=styles["Status"], textColor=colors.white
    ))]], colWidths=[22 * mm], rowHeights=[13 * mm])
    day_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GOLD_DARK),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    return [day_box, Paragraph(focus, styles["CardTitle"]), Paragraph(work, styles["CardBody"])]


doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=18 * mm,
    leftMargin=18 * mm,
    topMargin=18 * mm,
    bottomMargin=21 * mm,
    title="Ryan Jewelers Live and Marketing Readiness Report",
    author="OpenAI Codex",
    subject="Launch readiness audit dated 17 August 2026",
)

story = []

# Page 1 - Executive summary
story.append(Paragraph("LIVE STORE AUDIT - 17 AUGUST 2026", styles["Eyebrow"]))
story.append(Paragraph("Ryan Jewelers<br/>Live & Marketing Readiness", styles["ReportTitle"]))
story.append(Paragraph(
    "<b>URL:</b> https://ryan.varnijewels.com/ &nbsp;&nbsp; <b>Audit type:</b> Production storefront, release state, SEO and conversion readiness",
    styles["Small"],
))
story.append(Spacer(1, 7 * mm))

verdict = Table([
    [Paragraph("CURRENT VERDICT", styles["Eyebrow"]), pill("NOT READY YET", PALE_RED, RED)],
    [Paragraph("The website is publicly accessible and its SEO foundation is good, but full marketing should wait until the stale demo search index is cleaned, the pending fixes are deployed, and one complete payment order is verified.", styles["Body"]), ""],
], colWidths=[125 * mm, 38 * mm])
verdict.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ("BOX", (0, 0), (-1, -1), 0.8, GOLD),
    ("SPAN", (0, 1), (1, 1)),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
]))
story.append(verdict)
story.append(Spacer(1, 7 * mm))

story.append(Paragraph("ESTIMATED OVERALL READINESS", styles["Eyebrow"]))
score_row = Table([
    [Paragraph("60%", ParagraphStyle(
        name="Score", parent=styles["CardTitle"], fontSize=27, leading=30, textColor=GOLD_DARK
    )), ProgressBar(60, width=120 * mm, height=7 * mm)],
], colWidths=[35 * mm, 128 * mm])
score_row.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
]))
story.append(score_row)
story.append(Paragraph(
    "This is an operational estimate based on verified launch requirements, not a Google score.",
    styles["Small"],
))
story.append(Spacer(1, 6 * mm))

metrics = Table([
    [metric_card("Live catalog", "3,402", "real variants"), metric_card("Product designs", "18", "in sitemap")],
    [metric_card("Stale demo search", "191", "groups still indexed", PALE_RED), metric_card("Mobile LCP", "8.7s", "target: 2.5s or less", PALE_AMBER)],
], colWidths=[82 * mm, 82 * mm], rowHeights=[28 * mm, 28 * mm], hAlign="LEFT")
metrics.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
]))
story.append(metrics)
story.append(Spacer(1, 3 * mm))

summary_points = [
    "Minimum hands-on work remaining: approximately <b>2 to 3 working days</b> if backend cleanup and payment testing go smoothly.",
    "External Google indexing and Merchant Center review can take additional days after setup.",
    "Do not spend on paid ads until the P0 items in the critical work section are complete and purchase tracking is working.",
]
summary_table = Table([[Paragraph(f"<b>{i + 1}.</b> {text}", styles["Body"])] for i, text in enumerate(summary_points)], colWidths=[163 * mm])
summary_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE_GOLD),
    ("BOX", (0, 0), (-1, -1), 0.6, RULE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
]))
story.append(summary_table)

# Page 2 - Verified status
story.append(PageBreak())
story.append(Paragraph("VERIFIED STATUS", styles["Eyebrow"]))
story.append(Paragraph("What is already working", styles["SectionTitle"]))

checks = [
    check_row("PASS", "Public storefront and HTTPS", "Homepage, catalog and key legal pages returned HTTP 200 over HTTPS."),
    check_row("PASS", "Live catalog database", "2,340 DMY demo variants were deleted. The public catalog now reports 3,402 JWS real variants."),
    check_row("PASS", "SEO foundation", "Robots and sitemap return 200. Homepage, catalog and product pages include title, description and canonical tags. Lighthouse SEO scored 100."),
    check_row("PASS", "Policies and trust pages", "Contact, shipping, refund, privacy and terms pages are live and included in the sitemap."),
    check_row("PASS", "Payment methods available", "The live payment-method API currently returns Stripe and PayPal."),
    check_row("PARTIAL", "Demo-product removal", "The database and sitemap are clean, but the search index still returns 191 stale DMY product groups."),
    check_row("PARTIAL", "Local release fixes", "Header refresh-flash and homepage real-product filtering fixes are implemented locally. Eight targeted tests and the production build pass, but the changes are not deployed."),
    check_row("PARTIAL", "Checkout proof", "Checkout routes load, but no complete live order and payment confirmation was performed during this audit."),
]
check_table = Table(checks, colWidths=[38 * mm, 48 * mm, 77 * mm], repeatRows=0)
check_table.setStyle(TableStyle([
    ("GRID", (0, 0), (-1, -1), 0.45, RULE),
    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
]))
story.append(check_table)
story.append(Spacer(1, 7 * mm))

story.append(Paragraph("Important brand dependency", styles["SubTitle"]))
brand_box = Table([[Paragraph(
    "No visible JewelWeSell branding was found on the informational pages checked. However, the 18 live product designs still use JewelWeSell-hosted image URLs and an internal JewelWeSell tag/filter. If the requirement is zero JewelWeSell dependency anywhere, image hosting and product tagging must be migrated before the final launch.",
    styles["Body"],
)]], colWidths=[163 * mm])
brand_box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE_AMBER),
    ("BOX", (0, 0), (-1, -1), 0.6, AMBER),
    ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
]))
story.append(brand_box)
story.append(Spacer(1, 7 * mm))

story.append(Paragraph("Key source links", styles["SubTitle"]))
for source in [
    "Live site, sitemap and robots: https://ryan.varnijewels.com/ | /sitemap.xml | /robots.txt",
    "Google Core Web Vitals: https://developers.google.com/search/docs/appearance/core-web-vitals",
    "Google Merchant Center free listings: https://support.google.com/merchants/answer/13889434?hl=en",
]:
    story.append(Paragraph(source, styles["Source"]))

quality_heading = Paragraph("Release quality snapshot", styles["SubTitle"])
quality = [
    [Paragraph("Check", styles["CardTitle"]), Paragraph("Result", styles["CardTitle"]), Paragraph("Meaning", styles["CardTitle"])],
    [Paragraph("Production build", styles["CardBody"]), Paragraph("PASS", ParagraphStyle(name="q-pass", parent=styles["CardBody"], textColor=GREEN)), Paragraph("The current local code can produce a production bundle.", styles["CardBody"])],
    [Paragraph("Targeted tests", styles["CardBody"]), Paragraph("8 / 8 PASS", ParagraphStyle(name="q-tests", parent=styles["CardBody"], textColor=GREEN)), Paragraph("Header menu and demo-product filters are covered.", styles["CardBody"])],
    [Paragraph("Full type check", styles["CardBody"]), Paragraph("NOT CLEAN", ParagraphStyle(name="q-fail", parent=styles["CardBody"], textColor=RED)), Paragraph("692 errors and 155 warnings exist across the older codebase; at least one current header type mismatch should be fixed before release.", styles["CardBody"])],
    [Paragraph("Working tree", styles["CardBody"]), Paragraph("46 PATHS", ParagraphStyle(name="q-warn", parent=styles["CardBody"], textColor=AMBER)), Paragraph("25 tracked changes and 21 untracked paths need a scoped release commit.", styles["CardBody"])],
]
quality_table = Table(quality, colWidths=[40 * mm, 32 * mm, 91 * mm], repeatRows=1)
quality_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), PALE_GOLD),
    ("GRID", (0, 0), (-1, -1), 0.45, RULE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
]))
story.append(KeepTogether([quality_heading, quality_table]))

# Page 3 - Prioritized work
story.append(Paragraph("PRIORITIZED WORK", styles["Eyebrow"]))
story.append(Paragraph("Must finish before marketing", styles["SectionTitle"]))

story.append(issue_card(
    "P0 - 1",
    "Purge or rebuild the product search index",
    "A live search query for DMY products returns 191 stale groups, even though those variants are deleted from the catalog.",
    "Complete the backend search-index deletion/rebuild and verify that DMY returns zero results.",
    "1 to 3 hours if backend access works; otherwise dependent on platform support.",
))
story.append(issue_card(
    "P0 - 2",
    "Create a safe scoped release and deploy it",
    "The header refresh fix, demo filtering and image/performance changes are local. The worktree has 46 pending paths.",
    "Review the release diff, fix the new header type mismatch, commit only approved Ryan changes, deploy, warm the CDN and hard-refresh test.",
    "2 to 4 hours.",
))
story.append(issue_card(
    "P0 - 3",
    "Verify one complete real order flow",
    "Stripe and PayPal are listed, but this audit did not complete payment through order confirmation.",
    "Test product selection, cart, login, address, shipping, payment, success page, admin order, email and refund/cancel handling.",
    "2 to 3 hours if no provider issue is found.",
))
story.append(issue_card(
    "P0 - 4",
    "Retest and improve mobile speed after deployment",
    "One Lighthouse mobile lab run scored Performance 61, FCP 3.8s, LCP 8.7s and about 31 MB transferred.",
    "Deploy the pending WebP and loading changes, rerun Lighthouse, then optimize only the remaining LCP image/origin bottleneck. Target LCP: 2.5s or less.",
    "4 to 8 hours only if the deployed fixes do not reach the target.",
))

story.append(Paragraph("Marketing setup immediately after P0", styles["SectionTitle"]))
marketing = [
    [Paragraph("Priority", styles["CardTitle"]), Paragraph("Work", styles["CardTitle"]), Paragraph("Estimate", styles["CardTitle"])],
    [Paragraph("P1", styles["CardBody"]), Paragraph("Configure GA4 or GTM with valid IDs and verify view_item, add_to_cart, begin_checkout and purchase events. The live GTM setting is active but its ID is empty.", styles["CardBody"]), Paragraph("2 to 4 hrs", styles["CardBody"])],
    [Paragraph("P1", styles["CardBody"]), Paragraph("Verify Google Search Console, submit the existing sitemap and request indexing. No indexed site result was found in the audit search.", styles["CardBody"]), Paragraph("1 hr + wait", styles["CardBody"])],
    [Paragraph("P1", styles["CardBody"]), Paragraph("Set up Google Merchant Center free listings with product feed, accurate price/availability, shipping and return settings.", styles["CardBody"]), Paragraph("4 to 8 hrs + review", styles["CardBody"])],
    [Paragraph("Decision", styles["CardBody"]), Paragraph("If zero JewelWeSell dependency is required, move product images to Ryan-owned storage and replace the internal product tag/filter.", styles["CardBody"]), Paragraph("0.5 to 1 day", styles["CardBody"])],
]
marketing_table = Table(marketing, colWidths=[24 * mm, 105 * mm, 34 * mm], repeatRows=1)
marketing_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), PALE_GOLD),
    ("GRID", (0, 0), (-1, -1), 0.45, RULE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
]))
story.append(marketing_table)

# Page 4 - Plan and sources
story.append(Paragraph("RECOMMENDED PLAN", styles["Eyebrow"]))
story.append(Paragraph("Shortest path to marketing-ready", styles["SectionTitle"]))

timeline = [
    timeline_row("DAY 1", "Clean and deploy", "Purge the 191 stale search groups, scope the release diff, fix the new type mismatch, deploy the local header/product/performance fixes and run a basic live smoke test."),
    timeline_row("DAY 2", "Prove conversion", "Run the complete Stripe and PayPal checkout flow. Retest mobile Lighthouse. Fix only failures that block purchase or leave LCP materially slow."),
    timeline_row("DAY 3", "Connect marketing", "Configure analytics and purchase tracking, verify Search Console, submit the sitemap and connect Merchant Center free listings."),
    timeline_row("ONGOING", "Bring traffic", "Publish product-led Instagram, Pinterest and Google Business content. Start paid ads only after purchase tracking records a verified test order."),
]
timeline_table = Table(timeline, colWidths=[26 * mm, 40 * mm, 97 * mm])
timeline_table.setStyle(TableStyle([
    ("GRID", (0, 0), (-1, -1), 0.45, RULE),
    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
]))
story.append(timeline_table)
story.append(Spacer(1, 8 * mm))

story.append(Paragraph("Final recommendation", styles["SectionTitle"]))
recommendation = Table([[Paragraph(
    "<b>Start full marketing after the four P0 items are complete.</b><br/><br/>The practical target is 2 to 3 working days of hands-on work. Google indexing and Merchant Center approval may take additional time outside the development work. Until then, content preparation can continue, but paid traffic should wait.",
    styles["Body"],
)]], colWidths=[163 * mm])
recommendation.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE_GREEN),
    ("BOX", (0, 0), (-1, -1), 0.8, GREEN),
    ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
]))
story.append(recommendation)
story.append(Spacer(1, 8 * mm))

story.append(Paragraph("Audit limitations", styles["SubTitle"]))
story.append(Paragraph(
    "No real payment was charged, and private Search Console or Merchant Center account status was not available. Performance figures are from one Lighthouse mobile lab run and should be rechecked after deployment. Time estimates assume backend access is available and no payment-provider defect is discovered.",
    styles["Small"],
))

doc.build(story, onFirstPage=page_frame, onLaterPages=page_frame)
print(OUTPUT.resolve())
