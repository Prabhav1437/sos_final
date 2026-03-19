import sys
import base64
import io
try:
    import qrcode
except ImportError:
    print("Error: qrcode library not installed", file=sys.stderr)
    sys.exit(1)

def generate_qr(data: str) -> str:
    # Use yellow color as requested
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    # "QR Code Color 'YELLOW'"
    # High contrast is best: black on yellow or yellow on black.
    # We will use black (or dark blue) QR code on yellow background for uniqueness and scanning reliability
    img = qr.make_image(fill_color="#000080", back_color="#FFFF00") 
    
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

if __name__ == "__main__":
    try:
        if len(sys.argv) > 1:
            data = sys.argv[1]
        else:
            data = sys.stdin.read().strip()
            
        if not data:
            print("Error: No data provided", file=sys.stderr)
            sys.exit(1)
            
        b64_qr = generate_qr(data)
        print(b64_qr)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
