import ByteBuffer from "bytebuffer";

export class Serdes {
    
    private size(schema: {}){
        let propertiesLength = 0;
        let index = 0;

        for (let properties in schema){
            let value = schema[properties];
            
            if(this._isInteger(value)){
                propertiesLength++;
                index++;
            }
            else if(this._isObject(value)){
                propertiesLength += this.size(value);
            }
            else if(this._isString(value)){
                let propUtf8 = Buffer.from(value, "utf8");
                propertiesLength += propUtf8.length;
                index++;
            }
            
            
            
        }
        
        return index + propertiesLength;
    }
    
    private _isObject(value){
        return typeof value  === 'object';
    }
    
    private _isInteger(value){
        return Number.isInteger(value);
    }
    
    private _isString(value){
         return typeof value  === 'string';
    }
    
    private _serialize(buffer, schema): void {
        for (let properties in schema){
            let value = schema[properties];
            
            if(this._isInteger(value)){
                buffer.writeUint8(1);
                buffer.writeUint8(value);
            }
            else if(this._isObject(value)){
                this._serialize(buffer,value);
            }
            else if(this._isString(value)){
                let propUtf8 = Buffer.from(value, "utf8");
                buffer.writeUint8(propUtf8.length);
                buffer.append(propUtf8, "hex");
            }
        }
    }
    public serialize(schema: {}): ByteBuffer{

        
        const buffer = new ByteBuffer(this.size(schema), true);
        //const buffer = new ByteBuffer(index, true);
        this._serialize(buffer, schema);
        
    
       console.log(buffer);
        return buffer;
    }
    
    
    public deserialize(buf: ByteBuffer, schema: {}): {} {
            //console.log(schema);
        for (let properties in schema){
            let value = schema[properties];
            
            if(this._isInteger(value)){
                buf.readUint8();
                schema[properties] = buf.readUint8();
            }
            else if(this._isObject(value)){
                this.deserialize(buf,value);
            }
            else if(this._isString(value)){
                const Length = buf.readUint8();
                schema[properties] = buf.readString(Length);
            }
        }
        
        
       
        return  schema ;

    }
}