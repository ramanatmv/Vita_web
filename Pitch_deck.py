from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, Flowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing, Rect, String, Group, Line, Circle, Polygon
from reportlab.graphics import renderPDF

# --- Custom Color Palette ---
AGRI_GREEN = colors.HexColor("#2E7D32")  # Deep agricultural green
BRIGHT_GREEN = colors.HexColor("#66BB6A") # Vibrant green for highlights
SUN_YELLOW = colors.HexColor("#FBC02D")   # Corn/Sun yellow
EARTH_BROWN = colors.HexColor("#795548")  # Soil/Bad silage brown
ALERT_RED = colors.HexColor("#D32F2F")    # For problems/mold
LIGHT_BG = colors.HexColor("#F1F8E9")     # Very light green background tint

class BannerGraphic(Flowable):
    """Creates a colorful banner for slide titles"""
    def __init__(self, width, height, color=AGRI_GREEN):
        Flowable.__init__(self)
        self.width = width
        self.height = height
        self.color = color

    def draw(self):
        d = Drawing(self.width, self.height)
        # Main banner
        d.add(Rect(0, 0, self.width, self.height, fillColor=self.color, strokeColor=None))
        # Accent strip
        d.add(Rect(0, 0, self.width, self.height*0.1, fillColor=SUN_YELLOW, strokeColor=None))
        renderPDF.draw(d, self.canv, 0, 0)

class SimpleIcon(Flowable):
    """Drawing simple placeholder icons"""
    def __init__(self, type_str, size=50, color=AGRI_GREEN):
        Flowable.__init__(self)
        self.width = size
        self.height = size
        self.type_str = type_str
        self.color = color

    def draw(self):
        d = Drawing(self.width, self.height)
        cx, cy = self.width / 2, self.height / 2
        
        if self.type_str == 'phone':
             d.add(Rect(cx-15, cy-25, 30, 50, rx=5, ry=5, fillColor=self.color, strokeColor=None))
             d.add(Rect(cx-10, cy-20, 20, 35, fillColor=colors.white, strokeColor=None))
        elif self.type_str == 'brain':
             d.add(Circle(cx, cy, 20, fillColor=self.color, strokeColor=None))
             d.add(String(cx, cy-5, "AI", textAnchor='middle', fontSize=14, fillColor=colors.white))
        elif self.type_str == 'cert':
             d.add(Rect(cx-20, cy-25, 40, 50, fillColor=colors.white, strokeWidth=2, strokeColor=self.color))
             d.add(Circle(cx, cy-5, 12, fillColor=SUN_YELLOW, strokeColor=None))
             d.add(String(cx, cy-8, "A+", textAnchor='middle', fontSize=12, fillColor=AGRI_GREEN, fontName="Helvetica-Bold"))
        elif self.type_str == 'x_mark':
             d.add(Circle(cx, cy, 20, fillColor=ALERT_RED, strokeColor=None))
             d.add(String(cx, cy-7, "X", textAnchor='middle', fontSize=20, fillColor=colors.white, fontName="Helvetica-Bold"))
        elif self.type_str == 'check_mark':
             d.add(Circle(cx, cy, 20, fillColor=BRIGHT_GREEN, strokeColor=None))
        elif self.type_str == 'arrow_right':
             p = Polygon(points=[cx-20,cy+10, cx+10,cy+10, cx+10,cy+20, cx+30,cy, cx+10,cy-20, cx+10,cy-10, cx-20,cy-10], fillColor=SUN_YELLOW, strokeColor=None)
             d.add(p)
        
        renderPDF.draw(d, self.canv, 0, 0)

class VisualSilageSample(Flowable):
    """Simulates a silage visual sample panel"""
    def __init__(self, color, label, sublabel, size=150):
        Flowable.__init__(self)
        self.width = size
        self.height = size * 1.2
        self.sample_color = color
        self.label = label
        self.sublabel = sublabel

    def draw(self):
        d = Drawing(self.width, self.height)
        # The "Silage" rectangle representing the image
        d.add(Rect(10, 40, self.width-20, self.width-20, rx=10, ry=10, fillColor=self.sample_color, strokeColor=colors.grey, strokeWidth=1))
        
        if "Mold" in self.label:
             # Add some white/grey patches for mold
             d.add(Circle(40, 120, 15, fillColor=colors.lightgrey, strokeColor=None, fillOpacity=0.7))
             d.add(Circle(110, 80, 20, fillColor=colors.whitesmoke, strokeColor=None, fillOpacity=0.7))

        # Label background
        d.add(Rect(0, 0, self.width, 35, fillColor=AGRI_GREEN, strokeColor=None))
        # Text
        d.add(String(self.width/2, 20, self.label, textAnchor='middle', fontSize=12, fillColor=colors.white, fontName="Helvetica-Bold"))
        d.add(String(self.width/2, 5, self.sublabel, textAnchor='middle', fontSize=8, fillColor=colors.white))
        renderPDF.draw(d, self.canv, 0, 0)


def create_colorful_pitch_deck(filename):
    doc = SimpleDocTemplate(filename, pagesize=landscape(letter), rightMargin=inch/2, leftMargin=inch/2, topMargin=inch/2, bottomMargin=inch/2)
    elements = []
    styles = getSampleStyleSheet()

    # --- Styles ---
    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=32, textColor=colors.white, alignment=1, spaceAfter=20)
    subtitle_style = ParagraphStyle('SubtitleStyle', parent=styles['Normal'], fontSize=16, textColor=SUN_YELLOW, alignment=1)
    
    slide_title_style = ParagraphStyle('SlideTitle', parent=styles['Heading1'], fontSize=24, textColor=AGRI_GREEN, spaceAfter=15)
    
    heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=18, textColor=AGRI_GREEN, spaceAfter=10)
    normal_text = ParagraphStyle('Normal', parent=styles['Normal'], fontSize=12, leading=16, textColor=colors.darkgrey)
    white_text = ParagraphStyle('WhiteText', parent=styles['Normal'], fontSize=12, leading=16, textColor=colors.white, alignment=1)
    bold_white = ParagraphStyle('BoldWhite', parent=styles['Normal'], fontSize=14, leading=16, textColor=colors.white, alignment=1, fontName="Helvetica-Bold")


    # ====== Slide 1: Title Slide ======
    # Create a full-page colored background effect using a large table cell
    title_content = [
        [Spacer(1, 1*inch)],
        [Paragraph("AI Opportunity MVP", title_style)],
        [Paragraph("Computer Vision for Silage Quality Grading", title_style)],
        [Spacer(1, 0.5*inch)],
        [Paragraph("Building Trust & Premium Value for Gangpur Silage", subtitle_style)],
        [Spacer(1, 1.5*inch)],
    ]
    t_title = Table(title_content, colWidths=[9*inch])
    t_title.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), AGRI_GREEN),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(t_title)
    elements.append(PageBreak())


    # ====== Slide 2: The Problem (Visualized) ======
    elements.append(Paragraph("The Problem: The 'Trust Gap'", slide_title_style))
    elements.append(Spacer(1, 0.3*inch))

    # 3-Column Layout with Icons representing the problems
    prob_data = [
        [SimpleIcon('x_mark', color=ALERT_RED), SimpleIcon('x_mark', color=ALERT_RED), SimpleIcon('x_mark', color=ALERT_RED)],
        [Paragraph("No Quality Verification", heading_style), Paragraph("Commodity Pricing", heading_style), Paragraph("Slow Adoption", heading_style)],
        [Paragraph("Farmers buy on faith. Quality is invisible inside the bag.", normal_text), 
         Paragraph("Cannot command premium price without proof. Competing on price alone.", normal_text),
         Paragraph("High barrier to convincing new farmers to switch feed.", normal_text)]
    ]
    t_prob = Table(prob_data, colWidths=[3*inch, 3*inch, 3*inch])
    t_prob.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BACKGROUND', (0,1), (-1,1), LIGHT_BG), # Highlight headings
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(t_prob)
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("<i>Pain Point: 'Invisible Quality' prevents market scaling.</i>", ParagraphStyle('Quote', parent=normal_text, textColor=ALERT_RED, alignment=1, fontSize=14, fontName="Helvetica-Oblique")))
    elements.append(PageBreak())


    # ====== Slide 3: The Solution (Visual Workflow) ======
    elements.append(Paragraph("The Solution: Digital Quality Certificate", slide_title_style))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("A frictionless, mobile-based workflow to establish immediate trust.", normal_text))
    elements.append(Spacer(1, 0.3*inch))

    # Visual Flowchart using a table with icons and arrows
    flow_data = [
        [SimpleIcon('phone', size=60, color=BRIGHT_GREEN), SimpleIcon('arrow_right', size=40), SimpleIcon('brain', size=60, color=BRIGHT_GREEN), SimpleIcon('arrow_right', size=40), SimpleIcon('cert', size=60, color=BRIGHT_GREEN)],
        [Paragraph("1. Snap Photo", heading_style), "", Paragraph("2. AI Analysis", heading_style), "", Paragraph("3. Get Score", heading_style)],
        [Paragraph("VLI takes photo of silage sample on phone.", normal_text), "", Paragraph("Computer Vision checks Color, Mold, Texture.", normal_text), "", Paragraph("Instant 'A-Grade' Digital Certificate issued.", normal_text)]
    ]
    t_flow = Table(flow_data, colWidths=[2*inch, 1*inch, 2*inch, 1*inch, 2*inch])
    t_flow.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,0), 'BOTTOM'),
        ('VALIGN', (0,1), (-1,-1), 'TOP'),
    ]))
    elements.append(t_flow)
    elements.append(PageBreak())


    # ====== Slide 4: What We Are Grading (Visual Examples) ======
    elements.append(Paragraph("What the AI 'Sees' (Grading Criteria)", slide_title_style))
    elements.append(Spacer(1, 0.2*inch))

    # Visual Comparison Panels
    grading_data = [
        [VisualSilageSample(BRIGHT_GREEN, "A-GRADE: Ideal", "Yellow/Green, Nice Smell"), 
         VisualSilageSample(EARTH_BROWN, "B-GRADE: Poor", "Dark Brown (Overheated)"),
         VisualSilageSample(colors.dimgrey, "REJECT: Spoilage", "Visible Mold Patches")],
         
        [Paragraph("Optimal Fermentation. High nutritional value.", normal_text),
         Paragraph("Heat damage due to air leak. Lower nutrition.", normal_text),
         Paragraph("Health risk to animals. Immediate discard.", normal_text)]
    ]
    t_grading = Table(grading_data, colWidths=[3*inch, 3*inch, 3*inch])
    t_grading.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,0), 'BOTTOM'), # Align visuals to bottom of cell
        ('VALIGN', (0,1), (-1,-1), 'TOP'),    # Align text to top of cell
        ('PADDING', (0,0), (-1,-1), 15),
    ]))
    elements.append(t_grading)
    elements.append(PageBreak())


    # ====== Slide 5: Value Chain Impact (Infographic) ======
    elements.append(Paragraph("Value Chain Impact: Bi-Directional Benefit", slide_title_style))
    elements.append(Spacer(1, 0.4*inch))

    # A layout showing flow from Supply -> Process -> Demand
    vc_data = [
        [Paragraph("SUPPLY SIDE<br/>(Tribal Farmer)", bold_white), SimpleIcon('arrow_right'), Paragraph("PROCESSING<br/>(Gangpur VLI)", bold_white), SimpleIcon('arrow_right'), Paragraph("DEMAND SIDE<br/>(Dairy Farmer)", bold_white)],
        # Benefits Row
        [Paragraph("Benefit: Instant feedback on crop quality.<br/><br/>Outcome: Higher Price Realization.", white_text), "",
         Paragraph("Benefit: Batch separation (A vs B Grade).<br/><br/>Outcome: Operational Efficiency.", white_text), "",
         Paragraph("Benefit: Validated Nutritional Value.<br/><br/>Outcome: Trust & Premium Pricing.", white_text)]
    ]
    
    t_vc = Table(vc_data, colWidths=[2.5*inch, 1*inch, 2.5*inch, 1*inch, 2.5*inch])
    t_vc.setStyle(TableStyle([
        # Header Row styling (The Green Boxes)
        ('BACKGROUND', (0,0), (0,0), AGRI_GREEN),
        ('BACKGROUND', (2,0), (2,0), AGRI_GREEN),
        ('BACKGROUND', (4,0), (4,0), AGRI_GREEN),
        ('ROUNDEDCORNERS', (0,0), (0,0), 10),
        ('ROUNDEDCORNERS', (2,0), (2,0), 10),
        ('ROUNDEDCORNERS', (4,0), (4,0), 10),
        ('PADDING', (0,0), (-1,0), 15),
        
        # Content Row styling (The Lighter Boxes)
        ('BACKGROUND', (0,1), (0,1), BRIGHT_GREEN),
        ('BACKGROUND', (2,1), (2,1), BRIGHT_GREEN),
        ('BACKGROUND', (4,1), (4,1), BRIGHT_GREEN),
         ('ROUNDEDCORNERS', (0,1), (0,1), 10),
        ('ROUNDEDCORNERS', (2,1), (2,1), 10),
        ('ROUNDEDCORNERS', (4,1), (4,1), 10),
        ('PADDING', (0,1), (-1,1), 15),

        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(t_vc)
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("Bottom Line: Moving from Commodity to Premium Brand.", ParagraphStyle('BottomLine', parent=heading_style, alignment=1)))
    elements.append(PageBreak())

    # ====== Slide 6: Roadmap (Timeline Visual) ======
    elements.append(Paragraph("Roadmap: Q1 Execution Plan", slide_title_style))
    elements.append(Spacer(1, 0.5*inch))

    # A visual timeline using a table with colored headers acting as milestones
    roadmap_data = [
        ["STEP 1: Protocol", "STEP 2: Collection", "STEP 3: Training", "STEP 4: Pilot Launch"],
        [Paragraph("Define photo guidelines & grading rubric.", white_text), 
         Paragraph("Capture 1,000+ labeled images in field.", white_text), 
         Paragraph("Train basic CNN model (MobileNet).", white_text), 
         Paragraph("Deploy beta app to 5 VLIs for testing.", white_text)],
        ["Owner: Project Lead", "Owner: Field Team", "Owner: AI Lead", "Owner: Ops Team"]
    ]

    t_road = Table(roadmap_data, colWidths=[2.2*inch, 2.2*inch, 2.2*inch, 2.2*inch])
    t_road.setStyle(TableStyle([
        # Milestone Headers (Gradient-like effect with distinct colors)
        ('BACKGROUND', (0,0), (0,0), AGRI_GREEN),
        ('BACKGROUND', (1,0), (1,0), BRIGHT_GREEN),
        ('BACKGROUND', (2,0), (2,0), SUN_YELLOW),
        ('BACKGROUND', (3,0), (3,0), AGRI_GREEN),
        ('TEXTCOLOR', (0,0), (3,0), colors.white),
        ('FONTNAME', (0,0), (3,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (3,0), 12),
        ('PADDING', (0,0), (3,0), 15),
        
        # Content Rows
        ('BACKGROUND', (0,1), (3,1), colors.grey),
        ('BACKGROUND', (0,2), (3,2), LIGHT_BG),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,1), (-1,2), 10),
        ('GRID', (0,0), (-1,-1), 1, colors.white),
    ]))
    elements.append(t_road)
    elements.append(Spacer(1, 1*inch))
    
    # Call to Action Banner
    cta_data = [[Paragraph("IMMEDIATE NEXT STEP: Launch Data Collection Protocol.", bold_white)]]
    t_cta = Table(cta_data, colWidths=[8*inch])
    t_cta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SUN_YELLOW),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 15),
        ('ROUNDEDCORNERS', (0,0), (-1,-1), 10),
    ]))
    elements.append(t_cta)


    doc.build(elements)

create_colorful_pitch_deck('Gangpur_Silage_AI_MVP_Colorful_Pitch.pdf')