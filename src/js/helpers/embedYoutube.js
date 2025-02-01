import { Node } from 'tiptap';

export default class YoutubeEmbed extends Node {
  get name() {
    return 'youtube';
  }

  get schema() {
    return {
      attrs: {
        src: { default: null }
      },
      group: 'block',
      selectable: true,
      parseDOM: [
        {
          tag: 'iframe[src*="youtube.com"]',
          getAttrs: (dom) => ({
            src: dom.getAttribute('src')
          })
        }
      ],
      toDOM: (node) => [
        'iframe',
        {
          src: node.attrs.src,
          frameborder: '0',
          allowfullscreen: 'true'
        }
      ]
    };
  }

  commands({ type }) {
    return {
      setYoutubeVideo: (url) => (state, dispatch) => {
        const videoId = this.getYoutubeVideoId(url);
        if (!videoId) return false;

        const src = `https://www.youtube.com/embed/${videoId}`;
        const node = type.create({ src });
        const tr = state.tr.replaceSelectionWith(node);
        dispatch(tr);
      }
    };
  }

  getYoutubeVideoId(url) {
    const regex = new RegExp(
      '(?:https?:\\/\\/)?(?:www\\.)?(?:youtube\\.com\\/(?:[^/\\n\\s]+\\/\\S+\\/|(?:v|e(?:mbed)?)\\/|\\S*?[?&]v=)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})'
    );
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}