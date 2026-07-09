with open("index.html", "r") as f:
    content = f.read()

old_css = """        .promo-banner {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 2px solid #f59e0b;"""

new_css = """        .promo-banner {
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: #f1f5f9;
            border: 2px solid #f59e0b;"""

if old_css in content:
    content = content.replace(old_css, new_css)
    with open("index.html", "w") as f:
        f.write(content)
    print("Patched.")
else:
    print("Not found.")
