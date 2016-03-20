#import <stdio.h>

//forward declarations
char* string_copy_iter(char* destination, const char* source);
char* string_copy_recur(char* destination, const char* source);
char* strcpy(char *s1, const char *s2);


int main(int argc, char* argv[]) {

	char src[40];
	char dest[100];

	// Security risk:
	//   ~buffer overflow~ if using strcpy with a source string of unknown size:
	//   strcpy could write beyond allocated memory and cause unpredictable behaviour.

	// strcpy doesnt null terminate, so pre-allocating would be a good idea as well:
	// memset(dest, '\0', sizeof(dest));

	strcpy(src, "This is the strcpy string");
	strcpy(dest, src);
	printf("Final copied string : %s\n", dest);


	string_copy_iter(src, "This is the iter string");
	string_copy_iter(dest, src);
	printf("Final copied string : %s\n", dest);

	string_copy_recur(src, "This is the recur string");
	string_copy_recur(dest, src);
	printf("Final copied string : %s\n", dest);

	return(0);
}


// The original strcpy source
// doesn't null terminate the string
// or set the buffer size explicitly
char *
strcpy(char *s1, const char *s2)
{
    char *s = s1;
    while ((*s++ = *s2++) != 0)
	;
    return (s1);
}


char * 
string_copy_iter(char* destination, const char* source) {

	while (*source) {
		*destination = *source;
		destination++;
		source++;
	}

	//null terminate the string
	*destination = '\0';
	return destination;
}

/*
 * Body recursion bears a risk of stack overflow 
 *
 * better to try tail recusrion:
 * 'it often asymptotically reduces stack space requirements
 * from linear, or O(n), to constant, or O(1).''
 */
 
char *
string_copy_recur(char* destination, const char* source) {

	*destination = *source;

	if (!*source) {
		// null terminate
		*destination = '\0';
		return destination;	
	} else {
		// tail recurse
		return string_copy_recur( destination + 1, source + 1 );
	}
}

