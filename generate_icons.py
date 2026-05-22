# generate_icons.py
# A script to generate extension icons using Python's PIL library

import os
import sys

def check_pillow():
    try:
        from PIL import Image, ImageDraw
        return True
    except ImportError:
        return False

def install_pillow():
    print("Pillow not found. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])

if not check_pillow():
    try:
        install_pillow()
    except Exception as e:
        print(f"Failed to install Pillow: {e}")
        print("Please install Pillow manually using: pip install Pillow")
        sys.exit(1)

from PIL import Image, ImageDraw

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Google Keep signature color palette
KEEP_YELLOW = (251, 188, 4)      # #FBBC04
KEEP_BG_LIGHT = (254, 239, 195)  # #FEEFC3
DARK_GRAY = (60, 64, 67)         # #3C4043

for size in [16, 48, 128]:
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer circle/rounded rect representing Keep branding
    margin = max(1, size // 16)
    radius = size // 4
    
    # Rounded rect background
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=radius,
        fill=KEEP_YELLOW
    )
    
    # We will draw a lightbulb glyph in the center
    # Lightbulb coordinates centered in the image
    cx = size // 2
    cy = size // 2
    
    # Scale glyph based on icon size
    r = size // 5
    
    if size >= 48:
        # Draw lightbulb circle
        draw.ellipse([cx - r, cy - r - r//4, cx + r, cy + r - r//4], fill=KEEP_BG_LIGHT)
        # Draw lightbulb base/neck
        draw.rectangle([cx - r//2, cy + r//3, cx + r//2, cy + r], fill=DARK_GRAY)
        # Draw lightbulb thread lines
        draw.line([cx - r//3, cy + r + r//6, cx + r//3, cy + r + r//6], fill=(255,255,255), width=max(1, size // 32))
    else:
        # For size 16, just draw a small inner circle to keep it simple and clean
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=KEEP_BG_LIGHT)

    # Save image
    icon_path = f'icons/icon-{size}.png'
    img.save(icon_path)
    print(f"Successfully generated {icon_path} ({size}x{size} px)")

print("All icons generated successfully!")
