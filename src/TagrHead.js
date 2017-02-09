import Bloodhound from '../node_modules/corejs-typeahead/dist/bloodhound.min.js';
import Typeahead from '../node_modules/corejs-typeahead/dist/typeahead.bundle.min.js';
import Rx from '../node_modules/rx/dist/rx.all.js';
import Tags from './Tags';

class Tagrhead {
  constructor(containerDivId, el, dataSources) {
    this.el = el || '#search-input';
    this.dataSources = dataSources;
    this.bloodHounds = new Map();
    this.typeaheadSrch = undefined;
    this.containerDivId = containerDivId;
    this.subscription = undefined;
    this.typeaheadArr = [];
    this.createTypeAhead();
  }

  createBloodHoundConfig(dataSource) {
    return {
      datumTokenizer: function (data) {
        return Bloodhound.tokenizers.whitespace(data[dataSource.srchKey]);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: dataSource.data,
      limit: 3
    };
  }

  createSingleBloodHoundInitStream(bh, dataSource) {
    return Rx.Observable
      .fromPromise(bh.initialize())
      .map(response => {
        return {
          name: dataSource.name,
          displayKey: dataSource.displayKey,
          source: bh.ttAdapter(),
          templates: {
            header: dataSource.template ||
            '<h5 class="">' + dataSource.name + '</h5>'
          }
        };
      });
  }

  createBloodHoundsStream() {
    let streams = [];

    this.dataSources.map(dataSource => {
      let bh = new Bloodhound(this.createBloodHoundConfig(dataSource));
      let stream = this.createSingleBloodHoundInitStream(bh, dataSource);

      streams.push(stream);
      this.bloodHounds.set([dataSource.name, bh]);
    });
    return Rx.Observable.merge(...streams);
  }

  createTypeAheadStream() {
    let stream =
       this.createBloodHoundsStream()
         .do(response => { this.typeaheadArr.push(response); })
         .last();

    return stream;
  }

  createTypeAhead() {
    let stream = this.createTypeAheadStream();

    this.subscription = stream.subscribe(
      function (response) {},
      (err) => {console.log(err);},
      () => {
        $(this.el).innerHTML = '';
        this.typeaheadSrch =
           $(this.el).typeahead({
             hint: true,
             highlight: true,
             minLength: 0
           }, ... this.typeaheadArr);
         // console.log('finished initializing typeaheadSrch');

        this.createTags();
        // console.log('created tags');
      }
    );
  }

  getTypeAheadObj() {
    return this.typeaheadSrch;
  }

  createTags() {
    this.tags = new Tags(this.containerDivId, this.el);
  }

  stop() {
    this.tags.destroy();
    $(this.el).typeahead('destroy');
    // this.subscription.unsubscribe();
  }
}

module.exports = Tagrhead;
