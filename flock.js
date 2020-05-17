function sign(x) {
    if (x > 0) {
        return 1
    } else if (x == 0) {
        return 0
    } else {
        return -1
    }
}

class Boid {
    constructor() {
        this.position = createVector(random(width), random(height));
        this.velocity = createVector(random(-5, 5), random(-5, 5));
        // this.velocity.setMag(random(1, 3));
        this.acceleration = createVector();
        this.perception = 70;//random(20, 50);
        this.minimumRange = 20;
        this.maxAcceleration = 0.1;
        this.maxSpeed = 2;

        this.isStatic = false;
    }

    static createGuards() {
        let guards = [];
        // console.log('Creating guards');
        for (i = 0; i < width; i += 1) {
            let tmp = new Boid();
            tmp.isStatic = true;
            tmp.position.x = i;
            tmp.position.y = 0;
            tmp.velocity = createVector(0, 1);

            guards.push(tmp);

            tmp = new Boid();
            tmp.isStatic = true;
            tmp.position.x = i;
            tmp.position.y = height;
            tmp.velocity = createVector(0, -1);

            guards.push(tmp);
        }
        for (i = 0; i < height; i += 1) {
            let tmp = new Boid();
            tmp.isStatic = true;
            tmp.position.x = 0;
            tmp.position.y = i;
            tmp.velocity = createVector(1, 0);

            guards.push(tmp);

            tmp = new Boid();
            tmp.isStatic = true;
            tmp.position.x = width;
            tmp.position.y = i;
            tmp.velocity = createVector(-1, 0);

            guards.push(tmp);
        }
        // console.log('Done')
        return guards;


    }

    update() {

        if (this.isStatic) {
            return;
        }
        // this.velocity.setMag(this.maxSpeed);
        this.acceleration.limit(this.maxAcceleration);
        this.velocity.limit(this.maxSpeed);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);

        this.acceleration.mult(0.9);

        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height
        }
    }

    show() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        // strokeWeight(10);
        stroke(200);
        fill(200);
        //point(this.position.x, this.position.y);
        triangle(0, 0, -8, -4, -8, 4);

        pop();

        let velocityScale = 30;
        let accelerationScale = 50;
        // strokeWeight(2);
        // stroke(50, 200, 0, 50);
        // line(this.position.x, this.position.y,
        //     this.position.x + this.velocity.x * velocityScale,
        //     this.position.y + this.velocity.y * velocityScale);

        // strokeWeight(2);
        // stroke(250, 20, 0, 50);
        // line(this.position.x + this.velocity.x * velocityScale,
        //     this.position.y + this.velocity.y * velocityScale,
        //     this.position.x + this.velocity.x * velocityScale + this.acceleration.x * accelerationScale,
        //     this.position.y + this.velocity.y * velocityScale + this.acceleration.y * accelerationScale);
        
        // if (!this.isStatic) {
        //     strokeWeight(1);
        //     stroke(50);
        //     noFill();
        //     ellipse(this.position.x, this.position.y, this.perception * 2);

        //     strokeWeight(1);
        //     stroke(255, 0, 0);
        //     noFill();
        //     ellipse(this.position.x, this.position.y, this.minimumRange * 2);
        // }
    }

    align(boids) {
        if (this.isStatic) {
            return
        }
        let average = createVector();
        let neighborsCount = 0;
        boids.forEach(neighbor => {
            if (!neighbor.isStatic &&
                neighbor != this &&
                dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y) < this.perception) {
                average.add(neighbor.velocity);
                neighborsCount++
            }
        });
        if (neighborsCount > 0) {
            average.div(neighborsCount);
            this.acceleration.add(average.sub(this.velocity));
            this.acceleration.limit(this.maxAcceleration);
        }


    }

    cohesion(boids) {
        // if (this.isStatic) {
        //     return
        // }
        let average = createVector();
        let neighborsCount = 0;
        boids.forEach(neighbor => {
            if (!neighbor.isStatic &&
                neighbor != this &&
                dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y) < this.perception) {
                average.add(neighbor.position);
                neighborsCount++
            }
        });
        if (neighborsCount > 0) {
            average.div(neighborsCount);
            average.sub(this.position);
            // average.sub(this.velocity);

            // stroke(0,255,255);
            // line(this.position.x, this.position.y, this.position.x + average.x, this.position.y + average.y);

            average.limit(0.01);
            this.acceleration.add(average);
            this.acceleration.limit(this.maxAcceleration);
        }

    }

    separation(boids) {
        if (this.isStatic) {
            return
        }
        let average = createVector();
        let neighborsCount = 0;
        boids.forEach(neighbor => {
            let distance = dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
            if (neighbor != this) {
                if (distance < this.minimumRange) {
                    let diff = p5.Vector.sub(neighbor.position, this.position);

                    stroke(255, 0, 0);
                    line(neighbor.position.x, neighbor.position.y, this.position.x, this.position.y);

                    diff.mult(-1 / distance);

                    average.add(diff);

                    // stroke(255);
                    // line(this.position.x, this.position.y, this.position.x + average.x, this.position.y + average.y);

                    neighborsCount++
                }
            }
        });

        // check obstacles
        if (this.position.x - 0 < this.minimumRange && this.velocity.x < 0) {

            this.acceleration.add(createVector(4, 0));
        }
        if (this.position.y - 0 < this.minimumRange && this.velocity.y < 0) {
            this.acceleration.add(createVector(0, 4));
        }
        if (width - this.position.x < this.minimumRange && this.velocity.x > 0) {
            this.acceleration.add(createVector(-4, 0));
        }
        if (height - this.position.y < this.minimumRange && this.velocity.y > 0) {
            this.acceleration.add(createVector(0, -4));
        }

        if (neighborsCount > 0) {
            // average.div(neighborsCount);
            // average.sub(this.velocity);
            // average.limit(this.maxAcceleration);
            this.acceleration.add(average);
            // this.acceleration = average;
            // this.acceleration.limit(this.maxAcceleration);
        }

    }
}


const flock = [];

function setup() {
    createCanvas(800, 800)

    for (i = 0; i < 39; i++) {
        flock.push(new Boid(false));
    }

    // guards = Boid.createGuards();
    // guards.forEach(guard => {
    //     flock.push(guard);
    // })

    // frameRate(20);
}

function draw() {
    background(0, 95);

    flock.forEach(element => {
        element.align(flock);
        element.cohesion(flock);
        element.separation(flock);
        element.update();
        element.show();
    });
}