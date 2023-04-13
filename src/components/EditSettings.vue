<template>
  <div class="edit-wrap">
    <nav class="edti-nav">
      <button @click="() => $emit('close')">
        <span class="material-symbols-outlined"> arrow_back </span>
      </button>
      <h1>Edit Profile</h1>
    </nav>

    <div class="edit-content">
      <div class="image-container">
        <img :src="$store.state.user.user?.photoURL" />
        <div class="img-bloor">
          <span class="material-symbols-outlined"> add_a_photo </span>
        </div>
      </div>

      <div class="inputs_wrp">
        <div class="inpt-container">
       
          <input/>
       
        </div>
        <div class="inpt-container">
       
          <input/>
          
        </div>
        <div class="inpt-container">
        <textarea
          ref="textarea"
          v-on:input="(e) => handleTextArea(e.target.value, this)"
        />
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    v: Boolean,
  },
  data() {
    return {
      v: this.v,
    };
  },
  methods: {
    handleTextArea(v) {
      console.log("handleTextArea", v);

      let el = this.$refs.textarea;

      el.style.height = "45px";
      el.style.height = el.scrollHeight + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
$custom-c4: rgb(31, 31, 31);
$def-gray: #828282;
.edit-wrap {
  width: 100%;
  height: 100%;
  background-color: $custom-c4;
  z-index: 25;

  box-sizing: border-box;
}



    
.inpt-container {
  position: relative;
 
  width: 100%;
  box-sizing: border-box;
 
}

.inputs_wrp {
  width: 100%;
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;


  input {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 3px 0px 3px 5px;
    width: 100%;
    height: 45px;
    border-radius: 10px;
    box-sizing: border-box;
    border: 1px solid gray;

    font-size: 1rem;
    color: white;
    &:focus {
      border: 1px solid rgb(53, 107, 255);
    }

   
  }

  textarea {
    padding: 3px 0px 3px 5px;
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    margin-top: 15px;
    margin-bottom: 15px;
    color: white;
    width: 100%;
    height: 45px;
    border-radius: 10px;
    border: 1px solid gray;
    background: none;
    font-size: 1rem;
    line-height: 1.3125rem;

    &:focus {
      border: 1px solid rgb(53, 107, 255);
    }
  }
}

.edit-content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  .image-container {
    width: 120px;
    position: relative;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;

    .img-bloor {
      position: absolute;
      background-color: #0000005b;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #ffffff;
        font-size: 2.5rem;
        cursor: pointer;
        transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
        &:hover {
          transform: scale(1.3, 1.3);
        }
      }
    }

    img {
      width: 100%;
      min-height: 100%;
      object-fit: cover;
    }
  }
}

.edti-nav {
  width: 100%;
  height: 8%;
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    position: absolute;
    top: 10px;
    left: 10px;
    height: 10px;
    color: $def-gray;
  }

  h1 {
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 550;
    margin: 0% auto;
  }
}
</style>
