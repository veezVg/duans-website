// 编辑模式状态
let editMode = false;
let currentEditElement = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEditMode();
});

// 初始化编辑模式
function initializeEditMode() {
    // 创建编辑模式切换按钮
    const toggleButton = document.createElement('button');
    toggleButton.className = 'edit-mode-toggle';
    toggleButton.textContent = '编辑模式';
    toggleButton.onclick = toggleEditMode;
    document.body.appendChild(toggleButton);

    // 创建编辑面板
    const editPanel = document.createElement('div');
    editPanel.className = 'edit-panel';
    editPanel.id = 'editPanel';
    editPanel.innerHTML = `
        <h3>编辑内容</h3>
        <div id="editContent"></div>
    `;
    document.body.appendChild(editPanel);

    // 为所有可编辑元素添加编辑功能
    makeElementsEditable();
}

// 切换编辑模式
function toggleEditMode() {
    editMode = !editMode;
    const toggleButton = document.querySelector('.edit-mode-toggle');
    
    if (editMode) {
        toggleButton.textContent = '退出编辑';
        toggleButton.classList.add('active');
        showEditableElements();
    } else {
        toggleButton.textContent = '编辑模式';
        toggleButton.classList.remove('active');
        hideEditableElements();
        closeEditPanel();
    }
}

// 显示可编辑元素
function showEditableElements() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.style.display = 'block';
        if (!element.querySelector('.edit-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'edit-overlay';
            overlay.textContent = '点击编辑';
            element.appendChild(overlay);
        }
    });
}

// 隐藏可编辑元素标识
function hideEditableElements() {
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        const overlay = element.querySelector('.edit-overlay');
        if (overlay) {
            overlay.remove();
        }
    });
}

// 使元素可编辑
function makeElementsEditable() {
    // 文本内容
    const textElements = document.querySelectorAll('h1, h2, h3, p, li');
    textElements.forEach(element => {
        if (!element.closest('nav') && !element.closest('footer')) {
            element.classList.add('editable');
            element.addEventListener('click', function(e) {
                if (editMode) {
                    e.preventDefault();
                    editTextContent(this);
                }
            });
        }
    });

    // 图片
    const imageElements = document.querySelectorAll('img');
    imageElements.forEach(element => {
        if (!element.closest('nav')) {
            element.classList.add('editable');
            element.addEventListener('click', function(e) {
                if (editMode) {
                    e.preventDefault();
                    editImageContent(this);
                }
            });
        }
    });
}

// 编辑文本内容
function editTextContent(element) {
    currentEditElement = element;
    const editPanel = document.getElementById('editPanel');
    const editContent = document.getElementById('editContent');
    
    editContent.innerHTML = `
        <label>编辑文本内容:</label>
        <textarea id="textEditor">${element.textContent}</textarea>
        <button onclick="saveTextEdit()">保存</button>
        <button onclick="closeEditPanel()" class="cancel-btn">取消</button>
    `;
    
    editPanel.classList.add('open');
    document.getElementById('textEditor').focus();
}

// 编辑图片内容
function editImageContent(element) {
    currentEditElement = element;
    const editPanel = document.getElementById('editPanel');
    const editContent = document.getElementById('editContent');
    
    editContent.innerHTML = `
        <label>当前图片:</label>
        <img src="${element.src}" style="width: 100%; margin: 10px 0;">
        <label>替换图片:</label>
        <input type="file" id="imageUpload" accept="image/*" onchange="previewImage(this)">
        <div id="imagePreview"></div>
        <label>图片描述 (Alt文本):</label>
        <input type="text" id="altText" value="${element.alt}" style="width: 100%; padding: 8px; margin: 10px 0;">
        <button onclick="saveImageEdit()">保存</button>
        <button onclick="closeEditPanel()" class="cancel-btn">取消</button>
    `;
    
    editPanel.classList.add('open');
}

// 预览图片
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; margin: 10px 0;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 保存文本编辑
function saveTextEdit() {
    const newText = document.getElementById('textEditor').value;
    if (currentEditElement) {
        currentEditElement.textContent = newText;
    }
    closeEditPanel();
}

// 保存图片编辑
function saveImageEdit() {
    const fileInput = document.getElementById('imageUpload');
    const altText = document.getElementById('altText').value;
    
    if (currentEditElement) {
        // 更新alt文本
        currentEditElement.alt = altText;
        
        // 如果选择了新图片，更新图片源
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentEditElement.src = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
    closeEditPanel();
}

// 关闭编辑面板
function closeEditPanel() {
    const editPanel = document.getElementById('editPanel');
    editPanel.classList.remove('open');
    currentEditElement = null;
}

// 拖拽上传功能
function enableDragAndDrop() {
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        if (editMode && e.target.tagName === 'IMG') {
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    e.target.src = event.target.result;
                };
                reader.readAsDataURL(files[0]);
            }
        }
    });
}

// 启用拖拽上传
enableDragAndDrop();

