var canvas = document.getElementById("canva");
var ctx = canvas.getContext("2d");
// ctx.scale(0.5, 0.5);

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
}

class RChar {
    constructor(xx, yy, width=32) {
        this.offset_x = xx;
        this.offset_y = yy;
        this.box_size = width/8;
        this.box_ratio = 2.5;
        this.spacing_x = this.box_size*this.box_ratio;
        this.spacing_y = (1.1*(3*this.box_size+2*this.spacing_x) - 3*this.box_size)/2;
        this.extrude = this.box_size/2;
        this.box_radius = this.box_size/3;
        this.diagonal_length = Math.sqrt(Math.pow(this.box_size+this.spacing_x, 2) + Math.pow(this.box_size+this.spacing_y, 2));
        

        this.enable_arr = [];
        this.randInit();
        // <!-- this.init(); -->
        this.fillMissingDots();
    }

    randInit() {
        for (let i = 0; i < 25; ++i)
            this.enable_arr.push(Math.random()>0.5);
    }

    init() {
        this.enable_arr = [
            // dots [0 - 8]
            0, 0, 1,
            1, 1, 0,
            1, 0, 1,
            // horizontal slash [9 - 14]
            0, 0,
            1, 0,
            0, 0,
            // vertical slash [15 - 20]
            1, 0, 0,
            1, 0, 0,
            // main diagonal \ [21 - 22]
            0, 1,
            // off diagonal [23 - 24]
            0, 0,
        ]
    }

    fillMissingDots() {
        function enable_func() {
            let obj = arguments[0];
            for (let ii = 2; ii < arguments.length; ++ii)
                obj.enable_arr[arguments[1]] |= obj.enable_arr[arguments[ii]];
        }
        enable_func(this, 0, 9, 15, 21);
        enable_func(this, 1, 9, 10, 16);
        enable_func(this, 2, 10, 17, 24);
        enable_func(this, 3, 15, 18, 11);
        enable_func(this, 4, 11, 12, 16, 19, 21, 22, 23, 24);
        enable_func(this, 5, 12, 17, 20);
        enable_func(this, 6, 13, 18, 23);
        enable_func(this, 7, 13, 14, 19);
        enable_func(this, 8, 14, 20, 22);
    }

    draw() {
        let enable_ind = 0;
        ctx.fillStyle = "#30292F";
        // Dots
        for (let yy = 0; yy < 3; ++yy)
            for (let xx = 0; xx < 3; ++xx)
                if (this.enable_arr[enable_ind++])
                    ctx.roundRect(this.offset_x + (this.box_size+this.spacing_x)*xx, this.offset_y + (this.box_size+this.spacing_y)*yy, this.box_size, this.box_size, this.box_radius).fill();
        // Horizontal dashes
        for (let yy = 0; yy < 3; ++yy)
            for (let xx = 0; xx < 2; ++xx)
                if (this.enable_arr[enable_ind++])
                    ctx.fillRect(this.offset_x+this.box_size-this.extrude + (this.box_size+this.spacing_x)*xx, this.offset_y + (this.box_size+this.spacing_y)*yy, this.spacing_x+2*this.extrude, this.box_size);
        // Vertical dashes
        for (let yy = 0; yy < 2; ++yy)
            for (let xx = 0; xx < 3; ++xx)
                if (this.enable_arr[enable_ind++])
                    ctx.fillRect(this.offset_x + (this.box_size+this.spacing_x)*xx, this.offset_y+this.box_size-this.extrude + (this.box_size+this.spacing_y)*yy, this.box_size, this.spacing_y+2*this.extrude);
        // main diagonal
        if (this.enable_arr[enable_ind++])
        {
            ctx.save();
            ctx.translate(this.offset_x + this.box_size, this.offset_y);
            ctx.rotate(Math.atan2((2*this.box_size+2*this.spacing_y), (2*this.box_size+2*this.spacing_x)));
            ctx.fillRect(0, this.box_radius/2, this.diagonal_length, this.box_size);
            ctx.restore();
        }
        if (this.enable_arr[enable_ind++])
        {
            ctx.save();
            ctx.translate(this.offset_x + 2*this.box_size + this.spacing_x, this.offset_y + this.box_size + this.spacing_y);
            ctx.rotate(Math.atan2((2*this.box_size+2*this.spacing_y), (2*this.box_size+2*this.spacing_x)));
            ctx.fillRect(0, this.box_radius/2, this.diagonal_length, this.box_size);
            ctx.restore();
        }
        // off diagonal
        if (this.enable_arr[enable_ind++])
        {
            ctx.save();
            ctx.translate(this.offset_x, this.offset_y + 2*this.box_size + 2*this.spacing_y);
            ctx.rotate(Math.atan2(-(2*this.box_size+2*this.spacing_y), (2*this.box_size+2*this.spacing_x)));
            ctx.fillRect(0, this.box_radius/2, this.diagonal_length, this.box_size);
            ctx.restore();
        }
        if (this.enable_arr[enable_ind++])
        {
            ctx.save();
            ctx.translate(this.offset_x + this.box_size + this.spacing_x, this.offset_y + this.box_size + this.spacing_y);
            ctx.rotate(Math.atan2(-(2*this.box_size+2*this.spacing_y), (2*this.box_size+2*this.spacing_x)));
            ctx.fillRect(0, this.box_radius/2, this.diagonal_length, this.box_size);
            ctx.restore();
        }
    }

}
function populate_rune_table() {
    var c_width = canvas.getBoundingClientRect().width;
    var c_height = c_width - 100;
    if (c_height < screen.height/2)
        c_height = screen.height/2; 
    canvas.width = c_width;
    canvas.height = c_height;
    canvas.style.height = c_height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var size = c_width/20;
    var max_yy = Math.floor(c_height/(2*size));
    var max_xx = Math.floor(c_width/(2*size));
    for (let yy = 0; yy < max_yy; ++yy) {
        for (let xx = 0; xx < max_xx; ++xx) {
            randChar = new RChar((size+1.0*size) * xx, (size+1.0*size)*yy, size);
            randChar.draw();
        }
    }
}

populate_rune_table();