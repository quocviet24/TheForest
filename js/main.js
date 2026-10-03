// Cấu hình cơ bản cho game Phaser 3
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    pixelArt: true, // Quan trọng: Giữ cho pixel art không bị mờ khi scale
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Game Top-down nên không có trọng lực
            debug: false // Đổi thành true để xem khung va chạm khi code
        }
    },
    // Đăng ký các Scene (Màn hình) sẽ dùng trong game
    scene: [BootScene, GameScene, UIScene] 
};

// Khởi tạo game
const game = new Phaser.Game(config);