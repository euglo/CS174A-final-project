class Movement {
    constructor() {
        this.acceleration = 0;
        this.current_velocity = 0;
        this.dist = -15; //initial location
        this.unmod_dist = -15;
        this.dt = 0;
        this.reverse = false;
    
        this.acceleration_value = 11.87;
        this.acceleration_delta = 0.02;
        this.restart_time = 6;
    }

    train_start() {
        if(this.acceleration < this.acceleration_value && !this.reverse) {
            this.acceleration += this.acceleration_delta;
        } else if (this.reverse && this.acceleration > 0) {
            this.acceleration -= this.acceleration_delta;
        } else if (this.acceleration > this.acceleration_value) {
            this.reverse = true;
        } else if (this.reverse && this.acceleration <= 0) {
            this.reverse = false;
            this.acceleration = 0;
            return false;
        }
        return true;
    }

    train_stop() {
        if(this.acceleration >= -this.acceleration_value && !this.reverse) {
            this.acceleration -= this.acceleration_delta;
        } else if (this.reverse && this.acceleration <= 0) {
            this.acceleration += this.acceleration_delta;
        } else if (this.acceleration <= -this.acceleration_value) {
            this.reverse = true;
        } else if (this.current_velocity <= 0 || this.acceleration >= 0) {
            this.acceleration = 0;
            this.current_velocity = 0;
            return false;
        }
        return true;
    }

    common_move(dt) {
      this.current_velocity += dt * this.acceleration;
      if (this.dt >= this.restart_time) {
          this.dist = -15;
          this.dt = 0;
      }
      this.dist += this.current_velocity * dt;
      this.unmod_dist += this.current_velocity * dt;

      if(this.current_velocity != 0) {
          this.dt += dt;
      }
    }

    get_acceleration() {
        return this.acceleration;
    }

    get_translation(dt) {
        this.common_move(dt);
        return {
            dist: this.dist,
            unmod_dist: this.unmod_dist,
        };
    }
}

export { Movement };