const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The modal HTML
const devContactModalHTML = `
    <!-- MODAL: Developer Contact -->
    <div id="devContactModal" class="modal-overlay">
        <div class="modal-box" style="max-width: 350px; text-align: center;">
            <button class="close" onclick="closeDevContactModal()">&times;</button>
            <h2 style="justify-content: center; margin-bottom: 20px;"><i class="fas fa-code"></i> Developer Contact</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 24px;">Reach out to Spudy on your preferred platform:</p>
            <div style="display: flex; gap: 16px; justify-content: center;">
                <a href="https://wa.me/263776998296" target="_blank" class="btn btn-outline" style="flex: 1; border-color: #25d366; color: #25d366; padding: 12px;">
                    <i class="fab fa-whatsapp" style="font-size: 1.5rem; display: block; margin-bottom: 6px;"></i> WhatsApp
                </a>
                <a href="https://www.instagram.com/matipaishe_bessing/" target="_blank" class="btn btn-outline" style="flex: 1; border-color: #E1306C; color: #E1306C; padding: 12px;">
                    <i class="fab fa-instagram" style="font-size: 1.5rem; display: block; margin-bottom: 6px;"></i> Instagram
                </a>
            </div>
        </div>
    </div>
`;

// Insert the modal before the generic modal
html = html.replace('<!-- MODAL: HR Generic Modal for editing/adding -->', devContactModalHTML + '\n    <!-- MODAL: HR Generic Modal for editing/adding -->');

// Replace the links
const oldLink = '<a href="https://wa.me/263776998296" target="_blank" style="color: var(--primary); text-decoration: none;">Spudy</a>';
const newLink = '<a href="#" onclick="openDevContactModal(event)" style="color: var(--primary); text-decoration: none; cursor: pointer;">Spudy</a>';

html = html.split(oldLink).join(newLink);

// Add the JS
const devContactJS = `
        function openDevContactModal(e) {
            if(e) e.preventDefault();
            document.getElementById('devContactModal').classList.add('active');
        }
        function closeDevContactModal() {
            document.getElementById('devContactModal').classList.remove('active');
        }
`;

html = html.replace('function openHrmModal(type, id) {', devContactJS + '\n        function openHrmModal(type, id) {');

fs.writeFileSync('index.html', html);
console.log('Signature updated.');
