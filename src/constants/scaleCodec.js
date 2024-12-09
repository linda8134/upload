import * as $ from "scale-codec";
import {u8aToHex, hexToU8a, numberToU8a} from '@polkadot/util';

export const $OrdersArray = $.array($.str)

export const scaleCodecArray = (params) => {
  return $.uint8Array.encode(params)
}

export const decodeU32 = (params) => {
  if(typeof params === 'string'){
    return $.u32.decode(hexToU8a(params))
  }
  return $.u32.decode(params)
}

export const encodeU32 = (param) => {
  return u8aToHex($.u8.encode(numberToU8a(param)))
}


export const ArticleSechma = $.object(
  $.field('id', $.u64),
  $.field('title', $.str),
  $.field('content', $.str),
  $.field('author_id', $.u64),
  $.field('author_nickname', $.str),
  $.field('subspace_id', $.u64),
  $.field('ext_link', $.str),
  $.field('status', $.i16),
  $.field('weight', $.i16),
  $.field('created_time', $.u64),
  $.field('updated_time', $.u64),
)


export const SubspaceSechma = $.object(
  $.field('id', $.u64),
  $.field('title', $.str),
  $.field('slug', $.str),
  $.field('description', $.str),
  $.field('banner', $.str),
  $.field('status', $.i16),
  $.field('weight', $.i16),
  $.field('created_time', $.u64),
)

export const CommentSechma = $.object(
  $.field('id', $.u64),
  $.field('content', $.str),
  $.field('author_id', $.u64),
  $.field('author_nickname', $.str),
  $.field('article_id', $.u64),
  $.field('status', $.i16),
  $.field('weight', $.i16),
  $.field('created_time', $.u64),
)

export const BitVideoUserSchema = $.object(
  $.field('id', $.u64),
  $.field('handle', $.str),
  $.field('source', $.str),
  $.field('nickname', $.str),
  $.field('created_time', $.i64),
)
export const BitVideoSchema = $.object(
  $.field('id', $.u64),
  $.field('title', $.str),
  $.field('description', $.str),
  $.field('url', $.str),
  $.field('banner', $.str),
  $.field('created_time', $.i64),
)

export const BitVideoLikeSchema = $.object(
  $.field('id', $.u64),
  $.field('video_id', $.u64),
  $.field('user_id', $.u64),
  $.field('likenum', $.u64),
  $.field('created_time', $.i64),
)
export const BitVideoCommentSchema = $.object(
  $.field('id', $.u64),
  $.field('video_id', $.u64),
  $.field('user_id', $.u64),
  $.field('content', $.str),
  $.field('created_time', $.i64),
)

export class NonceAtomics {
  static int = new Uint32Array(new ArrayBuffer(32));
  static init(value){
    Atomics.store(this.int, 0, value)
  }
  static increase = () => {
    Atomics.add(this.int, 0, 1);
    return Atomics.load(this.int, 0)
  };
}
