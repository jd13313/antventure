import Phaser from 'phaser';
import foodItems from '../json/foodItems.json';
import effectsData from '../json/effects.json';
import antRed from '../Containers/AntRed';

class Play extends Phaser.Scene {
    constructor() {
        super('Play');
    }

    // Core Functions
    create() {
        const textStyles = {
            ...this.game.config.textStyles.default,
            ...this.game.config.textStyles.dropShadow
        };
        this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'grass').setOrigin(0, 0);
        this.add.text()
        this.add.text(10, 10, '⚔️ Antventure!', {...textStyles, fontSize: '36px' });
       
        const creditsLink =  this.add.text(this.game.config.width - 90, 10, '[ Credits ]', { ...textStyles, fontSize: '25px' });
        creditsLink.setInteractive();
        creditsLink.on('pointerdown', () => {
            this.scene.switch('Credits');
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.sounds = {
            eatSound: this.sound.add('eatSound')
        };
        this.preparePlayerCharacter();    
        this.prepareFoodItems();
        this.prepareAnimations();
        this.collisionActive = false;

        this.physics.add.collider(this.antGroup, this.foodItemsGroup, this.handleFoodItemCollision, null, this);
    };
    

    update() {
        this.handlePlayerMovement();
        const antStats = this.ant.getData('stats');
        
        if (antStats.health <= 0) {
            // Handle ant death here, e.g., restart the scene or show game over
            this.scene.restart();
            return;
        }
        
        this.ant.setData('stats', {
            ...antStats,
            health: antStats.health - .05
        })
        const gameStatsElement = document.getElementById('game-stats');
        
        gameStatsElement.innerHTML = `
            <li>Health: ${antStats.health}</li>
            <li>Intelligence: ${antStats.intelligence}</li>
            <li>Strength: ${antStats.strength}</li>
            <li>Dexterity: ${antStats.dexterity}</li>
            <li>Constitution: ${antStats.constitution}</li>
        `;
    }

    
    // Secondary Functions
    handleFoodItemCollision (ant, foodItem) {
        if (this.collisionActive) {
            return;
        }
        this.collisionActive = true;
        this.ant.bite();
        this.sounds.eatSound.play();
        const antFoodValue = ant.getData('food');
        const foodValue = foodItem.getData('foodValue');

        if ((antFoodValue + foodValue) <= 100) {
            ant.setData('food', antFoodValue + foodValue);
        } else {
            ant.setData('food', 100);
        }

        // Effects
        const foodItemEffects = foodItem.getData('effects');
        if (foodItemEffects){
            foodItemEffects.forEach(effect => {
                const effectData = effectsData[effect]
                ant.setData(effectData.impactedStat, ant.getData(effectData.impactedStat) + effectData.value);
                setTimeout(() => {
                    ant.setData(effectData.impactedStat, ant.getData(effectData.impactedStat) - effectData.value);
                }, effectData.duration);
            });
        }


        // Handle eating animations
        const foodAnimationName = foodItem.getData('eatAnimation');
        if (this.anims.exists(foodAnimationName)) {    
            foodItem.anims.play(foodAnimationName, true);
            foodItem.once('animationcomplete', () => {
                foodItem.destroy();
                this.collisionActive = false;
            });
        } else {
            this.collisionActive = false;
        }
    }

    prepareFoodItems() {
        const foodItemCount = Phaser.Math.Between(3, 15);
        const foodItemsTotal = foodItems.length;
        const foodItemGroupMembers = [];

        for (let i = 0; i < foodItemCount; i++) {
            const coords = this.getRandomCoords(50, 50, 50, 50);
            const randomFoodIndex = Phaser.Math.Between(0, foodItemsTotal - 1);
            const foodSprite = this.add.sprite(coords.x, coords.y, foodItems[randomFoodIndex].spriteName);
            foodSprite.setOrigin(0, 0);
            foodSprite.setData('foodValue', foodItems[randomFoodIndex].foodValue);
            foodSprite.setData('eatAnimation', foodItems[randomFoodIndex].spriteName + 'Eat');
            foodSprite.setData('effects', foodItems[randomFoodIndex].effects);
            foodItemGroupMembers.push(foodSprite);
        }

        this.foodItemsGroup = this.physics.add.group(foodItemGroupMembers, { key: 'foodItemsGroup' });
    }

    prepareAnimations() {
        this.anims.create({
            key: 'foodStrawberryEat',
            frames: this.anims.generateFrameNumbers('foodStrawberry', { start: 0, end: 3 }),
            repeat: 0
        });

        this.anims.create({
            key: 'foodMeatEat',
            frames: this.anims.generateFrameNumbers('foodMeat', { start: 0, end: 3 }),
            repeat: 0
        })
    }

    /**
     * Create player sprite, animations, and data.
     */
    preparePlayerCharacter() {
        this.ant = new antRed(this, 100, 300);
        const antHead = this.ant.list[this.ant.ANT_BODY_PARTS.HEAD];
        this.antGroup = this.physics.add.group(antHead, { key: 'antGroup' });
    }

    /**
     * Setup player movement, animation enabling, and controls.
     */
    handlePlayerMovement() {
        if (this.collisionActive) {
            return;
        }

        let direction = Object.entries(this.cursors).find(([, keyData]) => {
            return keyData.isDown;
        });

        direction = direction ? direction[0] : 'none';
        
        this.ant.moveInDirection(direction);
    }

    /**
     * Picks a random location on the screen.
     * Optionally accounts for clearance on the top Top and Bottom.
     * @param {integer} clearanceTopX 
     * @param {integer} clearanceTopY 
     * @param {integer} clearanceBottomX 
     * @param {integer} clearanceBottomY 
     * @returns 
     */
    getRandomCoords(clearanceTopX = 0, clearanceTopY = 0, clearanceBottomX = 0, clearanceBottomY = 0) {
        return {
            x: Phaser.Math.Between(0 + clearanceTopX, this.game.config.width - clearanceBottomX),
            y: Phaser.Math.Between(0 + clearanceTopY, this.game.config.height - clearanceBottomY)
        }
    }
}

export default Play;