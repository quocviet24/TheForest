class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
    }

    create() {
        this.totalScore = 0;
        this.scoreText = this.add.text(20, 20, 'FOREST SCORE: 0', { fill: '#fff', fontSize: '24px', fontFamily: 'monospace' });

        this.panel = this.add.container(240, 100);
        this.panel.setVisible(false);

        let bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.lineStyle(4, 0xffffff);
        bg.fillRect(0, 0, 800, 500);
        bg.strokeRect(0, 0, 800, 500);
        this.panel.add(bg);

        this.situationText = this.add.text(40, 40, '', { fill: '#fff', fontSize: '20px', wordWrap: { width: 720 }, fontFamily: 'monospace' });
        this.questionText = this.add.text(40, 110, '', { fill: '#ffcc00', fontSize: '24px', fontStyle: 'bold', fontFamily: 'monospace' });
        
        // Thêm text để hiển thị Feedback sau khi chọn
        this.feedbackText = this.add.text(40, 180, '', { fill: '#00ffcc', fontSize: '20px', wordWrap: { width: 720 }, fontFamily: 'monospace' });
        this.insightText = this.add.text(40, 300, '', { fill: '#ffffff', fontSize: '18px', fontStyle: 'italic', wordWrap: { width: 720 }, fontFamily: 'monospace' });
        this.panel.add([this.situationText, this.questionText, this.feedbackText, this.insightText]);

        this.optionTexts = [];
        for(let i = 0; i < 4; i++) {
            let opt = this.add.text(40, 180 + (i * 60), '', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' });
            
            // Cho phép click vào đáp án
            opt.setInteractive({ useHandCursor: true });
            
            // Hiệu ứng hover chuột
            opt.on('pointerover', () => opt.setFill('#ffcc00'));
            opt.on('pointerout', () => opt.setFill('#ffffff'));
            
            // Sự kiện khi click chọn đáp án
            opt.on('pointerdown', () => this.selectOption(i));

            this.panel.add(opt);
            this.optionTexts.push(opt);
        }

        // Nút Đóng / Tiếp tục (Mặc định ẩn, chỉ hiện khi đã chọn đáp án xong)
        this.closeButton = this.add.text(350, 430, '[ TIẾP TỤC ]', { fill: '#fff', fontSize: '22px', backgroundColor: '#333', padding: { x: 10, y: 5 }, fontFamily: 'monospace' });
        this.closeButton.setInteractive({ useHandCursor: true });
        this.closeButton.on('pointerdown', () => this.closePanel());
        this.closeButton.setVisible(false);
        this.panel.add(this.closeButton);
    }

    showQuestion(questionId) {
        this.currentData = this.cache.json.get('gameData').questions[questionId];
        
        this.situationText.setText("TÌNH HUỐNG: " + this.currentData.situation);
        this.questionText.setText(this.currentData.question);
        
        // Reset lại giao diện trạng thái chọn đáp án
        this.feedbackText.setText('');
        this.insightText.setText('');
        this.closeButton.setVisible(false);

        for(let i = 0; i < 4; i++) {
            if(this.currentData.options[i]) {
                this.optionTexts[i].setText("○ " + this.currentData.options[i].id + ". " + this.currentData.options[i].text);
                this.optionTexts[i].setVisible(true); // Hiện lại các đáp án
            }
        }
        this.panel.setVisible(true);
    }

    selectOption(index) {
        let selectedOption = this.currentData.options[index];
        
        // Cộng điểm
        this.totalScore += selectedOption.score;
        this.scoreText.setText('FOREST SCORE: ' + this.totalScore);

        // Ẩn 4 đáp án đi
        this.optionTexts.forEach(opt => opt.setVisible(false));

        // Hiện Feedback và Ranger Insight
        this.feedbackText.setText(`[ +${selectedOption.score} ĐIỂM ]\nPHẢN HỒI: ${selectedOption.feedback}`);
        this.insightText.setText(`RANGER INSIGHT: ${this.currentData.rangerInsight}`);
        
        // Hiện nút Tiếp tục
        this.closeButton.setVisible(true);
    }

    closePanel() {
        this.panel.setVisible(false);
        // Báo cho GameScene biết là đã tương tác xong để mở khóa di chuyển
        this.scene.get('GameScene').isInteracting = false; 
    }
} 