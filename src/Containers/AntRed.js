class AntRed extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene.add.existing(this);
        //this.setInteractive();
        this.setupData();
        this.setupSprites();
        
        this.ANT_BODY_PARTS = {
            HEAD: 0,
            THORAX: 1,
            ABDOMEN: 2,
            LEGS_R: 3,
            LEGS_L: 4
        };
    }
    //
    // Setup Methods
    //

    /**
     * Setup stats and effects data.
     */
    setupData() {
        this.setData('stats', {
            health: 100,
            intelligence: 1,
            strength: 1,
            dexterity: 1,
            constitution: 1
        });

        this.setData('activeEffects', {
            speedBoost: false,
            healthBoost: false,
            attackBoost: false
        });
    }

    //
    // Sprite & animation methods
    //
    
    /**
     * Create sprites from ant body parts, then add them to the container.
     * Additionally, setup animations for each body part.
     */
    setupSprites() {
        const head = this.scene.add.sprite(18, 0, 'antRedHead').setInteractive();
        const thorax = this.scene.add.sprite(18, 19, 'antRedThorax');
        const abdomen = this.scene.add.sprite(18, 39, 'antRedAbdomen');
        const legsL = this.scene.add.sprite(36, 18, 'antRedLegs');
        const legsR = this.scene.add.sprite(0, 18, 'antRedLegs').setFlipX(true).setFlipY(true);

        head.anims.create({
            key: 'antRedHeadBite',
            frames: head.anims.generateFrameNumbers('antRedHead', { start: 0, end: 1 }),
            framerate: 2,
            repeat: 7
        });

        abdomen.anims.create({
            key: 'antRedButtWiggle',
            frames: abdomen.anims.generateFrameNumbers('antRedAbdomen', { start: 0, end: 1 }),
            framerate: 2,
            repeat: 1
        });

        legsL.anims.create({
            key: 'antRedLegsLeftWalk',
            frames: legsL.anims.generateFrameNumbers('antRedLegs', { start: 0, end: 2 }),
            framerat: 2,
            repeat: 1
        });

        legsR.anims.create({
            key: 'antRedLegsRightWalk',
            frames: legsR.anims.generateFrameNumbers('antRedLegs', { start: 0, end: 2 }),
            framerat: 2,
            repeat: 1
        });


        this.add([
            head, 
            thorax, 
            abdomen, 
            legsR, 
            legsL
        ]);
    }

    /**
     * Plays an animation on the specified body part.
     * @param {integer} antBodyPartIndex 
     * @param {string} animationName 
     */
    playAnimation(antBodyPartIndex = 0, animationName = 'antRedHeadBite') {
        const sprite = this.getAt(antBodyPartIndex);
        sprite.anims.play(animationName, true);
    }

    /**
     * Alias for bite animations
     */
    bite() {
        this.playAnimation(this.ANT_BODY_PARTS.HEAD, 'antRedHeadBite');
    }


    calculateMoveDistance() {
        const speed = this.getData('stats')?.dexterity || 1;
        // todo: Eventually do some math here

        return speed;
    }

    /**
     * Moves the ant in the specified direction.
     * @param {string} direction 
     */
    moveInDirection(direction) {
        const distance = this.calculateMoveDistance();

        switch (direction) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.playAnimation(this.ANT_BODY_PARTS.ABDOMEN, 'antRedButtWiggle');
                this.playAnimation(this.ANT_BODY_PARTS.LEGS_R, 'antRedLegsRightWalk');
                this.playAnimation(this.ANT_BODY_PARTS.LEGS_L, 'antRedLegsLeftWalk');
            
                switch(direction) {
                    case 'up':
                        this.y -= distance;
                        this.rotation = 0;
                        break;
                    case 'down':
                        this.y += distance;
                        this.rotation = Math.PI;
                        break;
                    case 'left':
                        this.x -= distance;
                        this.rotation = -Math.PI / 2;
                        break;
                    case 'right':
                        this.x += distance;
                        this.rotation = Math.PI / 2;
                        break;
                }
            default:
                break;
        }
    }
}

export default AntRed;