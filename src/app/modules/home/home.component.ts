import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

import {Router} from '@angular/router';

import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchForm = new FormControl();
  searchVersion = new FormControl();
  saveValueChanges = true;
  filteredSearch: any = [];
  mockResponse: any;
  toHighlight ='';
  isFullChapterView = false;
  versions:any = [];
  resultBookName: any;
 
  constructor(private apiService: ApiService, private searchService: SearchService, private router: Router) { 
    
    // this.searchForm.valueChanges
    //   .pipe(
    //     filter(() => this.saveValueChanges),
    //     debounceTime(500)
    //   )
    //   .subscribe(values =>{
        
    //     this._filterStates(values,this.searchVersion.value);
    //   });

    //   this.searchVersion.valueChanges
    //   .pipe(
    //     filter(() => this.saveValueChanges),
    //     debounceTime(500)
    //   )
    //   .subscribe(values =>{
        
    //     this._filterStates(this.searchForm.value,values);
    //   });

  }
  
  ngOnInit(): void {
   
    this.getVersion();

  }
  
  onSearch() { 
    this._filterStates(this.searchForm.value,this.searchVersion.value);
  }
  
  onKeydown(event: { key: string; }) {
    if (event.key === "Enter") {
      this.onSearch();
    }
  }

  private getVersion(){
    this.apiService
      .callGetAPI('api/v1/search/get-versions')
      .subscribe(data => {
          if (data['statusCode'] === 200 && data['error'] === false) {
           // console.log(data);
            this.versions = data['response'].data;
            if(this.versions.indexOf("KJV") == -1 ){
               this.searchVersion.setValue(this.versions[0]); 
            } else {
              this.searchVersion.setValue('KJV');
            }
            
          }
      }, error => {});
  }

  private _filterStates(value: string, version:string) {
    if (typeof value !== 'undefined' && value !== null && value.length > 0) {
      this.toHighlight = value;
      console.log('cal',value);
      const url = 'search';
      
      let chapterAll = [];

      for(let i=1;i<200;i++){
        chapterAll.push(i.toString());
      }
      this.isFullChapterView = false;
      if(value.indexOf(":") < 0){
            let splitArr1 = value.split(' ');
            let CountOfSplitArr = splitArr1.length;
            let lastValue = splitArr1[CountOfSplitArr-1];
            
            if(chapterAll.includes(lastValue)){
              this.isFullChapterView = true;
            } else {
              this.isFullChapterView = false;
            }            
      }  

      this.apiService
      .callGetAPI('api/v1/search?search_word='+value+'&search_version='+version)
      .subscribe(data => { 
          if (data['statusCode'] === 200 && data['error'] === false) {
            
              let groupifyData = data['response'].data;
              let objModified = new Array();

              groupifyData.forEach((el:any) => { //console.log(typeof objModified);
              // check to see if we already have a new object ready for this department...

              if (objModified.filter((el2: any) => el2.chapter == el.chapter).length == 0) {
                // we don't, so create it and start the persons array
                objModified.push({
                chapter : el.chapter,
                bookName : el.book,
                bData: [el]
                }) 
              } else {
              // we do, so find it and add another person
                objModified.forEach(el3 => {
                if (el3.chapter == el.chapter) el3.bData.push(el);
                })
              }
              })

            this.filteredSearch.details = objModified;  
            //this.filteredSearch.bookName = data['response'].data[0].book;
            this.filteredSearch.clipboardURL = location.origin+'/search/'+value+'/'+version;
            this.searchService.subject.next(this.filteredSearch); 
            this.router.navigateByUrl('/search');
          }
      }, error => {});
      
    }
  }

  getFullChapter(bookName: string,chapter:string) {
    if (typeof bookName !== 'undefined' && bookName !== null && typeof chapter !== 'undefined' && chapter !== null) {
      
      let value = bookName+' '+chapter;
      let version = this.searchVersion.value;
      this._filterStates(value,version);
      this.isFullChapterView = true;
    }
  }

  getMobileMenu(){
    
  }

}
